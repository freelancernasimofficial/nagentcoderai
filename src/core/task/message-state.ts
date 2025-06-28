import { combineApiRequests } from "@/shared/combineApiRequests"
import { ensureTaskDirectoryExists, saveApiConversationHistory, savenAgentCoderAIMessages } from "../storage/disk"
import * as vscode from "vscode"
import { nAgentCoderAIMessage } from "@/shared/ExtensionMessage"
import { getApiMetrics } from "@/shared/getApiMetrics"
import { combineCommandSequences } from "@/shared/combineCommandSequences"
import { findLastIndex } from "@/shared/array"
import getFolderSize from "get-folder-size"
import os from "os"
import * as path from "path"
import CheckpointTracker from "@integrations/checkpoints/CheckpointTracker"
import { HistoryItem } from "@/shared/HistoryItem"
import Anthropic from "@anthropic-ai/sdk"
import { TaskState } from "./TaskState"

interface MessageStateHandlerParams {
	context: vscode.ExtensionContext
	taskId: string
	taskIsFavorited?: boolean
	updateTaskHistory: (historyItem: HistoryItem) => Promise<HistoryItem[]>
	taskState: TaskState
}

const cwd = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath).at(0) ?? path.join(os.homedir(), "Desktop") // may or may not exist but fs checking existence would immediately ask for permission which would be bad UX, need to come up with a better solution

export class MessageStateHandler {
	private apiConversationHistory: Anthropic.MessageParam[] = []
	private nagentcoderaiMessages: nAgentCoderAIMessage[] = []
	private taskIsFavorited: boolean
	private checkpointTracker: CheckpointTracker | undefined
	private updateTaskHistory: (historyItem: HistoryItem) => Promise<HistoryItem[]>
	private context: vscode.ExtensionContext
	private taskId: string
	private taskState: TaskState

	constructor(params: MessageStateHandlerParams) {
		this.context = params.context
		this.taskId = params.taskId
		this.taskState = params.taskState
		this.taskIsFavorited = params.taskIsFavorited ?? false
		this.updateTaskHistory = params.updateTaskHistory
	}

	setCheckpointTracker(tracker: CheckpointTracker | undefined) {
		this.checkpointTracker = tracker
	}

	getApiConversationHistory(): Anthropic.MessageParam[] {
		return this.apiConversationHistory
	}

	setApiConversationHistory(newHistory: Anthropic.MessageParam[]): void {
		this.apiConversationHistory = newHistory
	}

	getnAgentCoderAIMessages(): nAgentCoderAIMessage[] {
		return this.nagentcoderaiMessages
	}

	setnAgentCoderAIMessages(newMessages: nAgentCoderAIMessage[]) {
		this.nagentcoderaiMessages = newMessages
	}

	async savenAgentCoderAIMessagesAndUpdateHistory(): Promise<void> {
		try {
			await savenAgentCoderAIMessages(this.context, this.taskId, this.nagentcoderaiMessages)

			// combined as they are in ChatView
			const apiMetrics = getApiMetrics(combineApiRequests(combineCommandSequences(this.nagentcoderaiMessages.slice(1))))
			const taskMessage = this.nagentcoderaiMessages[0] // first message is always the task say
			const lastRelevantMessage =
				this.nagentcoderaiMessages[
					findLastIndex(
						this.nagentcoderaiMessages,
						(message) => !(message.ask === "resume_task" || message.ask === "resume_completed_task"),
					)
				]
			const taskDir = await ensureTaskDirectoryExists(this.context, this.taskId)
			let taskDirSize = 0
			try {
				// getFolderSize.loose silently ignores errors
				// returns # of bytes, size/1000/1000 = MB
				taskDirSize = await getFolderSize.loose(taskDir)
			} catch (error) {
				console.error("Failed to get task directory size:", taskDir, error)
			}
			await this.updateTaskHistory({
				id: this.taskId,
				ts: lastRelevantMessage.ts,
				task: taskMessage.text ?? "",
				tokensIn: apiMetrics.totalTokensIn,
				tokensOut: apiMetrics.totalTokensOut,
				cacheWrites: apiMetrics.totalCacheWrites,
				cacheReads: apiMetrics.totalCacheReads,
				totalCost: apiMetrics.totalCost,
				size: taskDirSize,
				shadowGitConfigWorkTree: await this.checkpointTracker?.getShadowGitConfigWorkTree(),
				cwdOnTaskInitialization: cwd,
				conversationHistoryDeletedRange: this.taskState.conversationHistoryDeletedRange,
				isFavorited: this.taskIsFavorited,
			})
		} catch (error) {
			console.error("Failed to save nagentcoderai messages:", error)
		}
	}

	async addToApiConversationHistory(message: Anthropic.MessageParam) {
		this.apiConversationHistory.push(message)
		await saveApiConversationHistory(this.context, this.taskId, this.apiConversationHistory)
	}

	async overwriteApiConversationHistory(newHistory: Anthropic.MessageParam[]): Promise<void> {
		this.apiConversationHistory = newHistory
		await saveApiConversationHistory(this.context, this.taskId, this.apiConversationHistory)
	}

	async addTonAgentCoderAIMessages(message: nAgentCoderAIMessage) {
		// these values allow us to reconstruct the conversation history at the time this nagentcoderai message was created
		// it's important that apiConversationHistory is initialized before we add nagentcoderai messages
		message.conversationHistoryIndex = this.apiConversationHistory.length - 1 // NOTE: this is the index of the last added message which is the user message, and once the nagentcoderaimessages have been presented we update the apiconversationhistory with the completed assistant message. This means when resetting to a message, we need to +1 this index to get the correct assistant message that this tool use corresponds to
		message.conversationHistoryDeletedRange = this.taskState.conversationHistoryDeletedRange
		this.nagentcoderaiMessages.push(message)
		await this.savenAgentCoderAIMessagesAndUpdateHistory()
	}

	async overwritenAgentCoderAIMessages(newMessages: nAgentCoderAIMessage[]) {
		this.nagentcoderaiMessages = newMessages
		await this.savenAgentCoderAIMessagesAndUpdateHistory()
	}

	async updatenAgentCoderAIMessage(index: number, updates: Partial<nAgentCoderAIMessage>): Promise<void> {
		if (index < 0 || index >= this.nagentcoderaiMessages.length) {
			throw new Error(`Invalid message index: ${index}`)
		}

		// Apply updates to the message
		Object.assign(this.nagentcoderaiMessages[index], updates)

		// Save changes and update history
		await this.savenAgentCoderAIMessagesAndUpdateHistory()
	}
}
