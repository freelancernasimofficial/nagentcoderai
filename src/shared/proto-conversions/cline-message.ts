import { nAgentCoderAIMessage as AppnAgentCoderAIMessage, nAgentCoderAIAsk as AppnAgentCoderAIAsk, nAgentCoderAISay as AppnAgentCoderAISay } from "@shared/ExtensionMessage"

import { nAgentCoderAIMessage as ProtonAgentCoderAIMessage, nAgentCoderAIMessageType, nAgentCoderAIAsk, nAgentCoderAISay } from "@shared/proto/ui"

// Helper function to convert nAgentCoderAIAsk string to enum
function convertnAgentCoderAIAskToProtoEnum(ask: AppnAgentCoderAIAsk | undefined): nAgentCoderAIAsk | undefined {
	if (!ask) {
		return undefined
	}

	const mapping: Record<AppnAgentCoderAIAsk, nAgentCoderAIAsk> = {
		followup: nAgentCoderAIAsk.FOLLOWUP,
		plan_mode_respond: nAgentCoderAIAsk.PLAN_MODE_RESPOND,
		command: nAgentCoderAIAsk.COMMAND,
		command_output: nAgentCoderAIAsk.COMMAND_OUTPUT,
		completion_result: nAgentCoderAIAsk.COMPLETION_RESULT,
		tool: nAgentCoderAIAsk.TOOL,
		api_req_failed: nAgentCoderAIAsk.API_REQ_FAILED,
		resume_task: nAgentCoderAIAsk.RESUME_TASK,
		resume_completed_task: nAgentCoderAIAsk.RESUME_COMPLETED_TASK,
		mistake_limit_reached: nAgentCoderAIAsk.MISTAKE_LIMIT_REACHED,
		auto_approval_max_req_reached: nAgentCoderAIAsk.AUTO_APPROVAL_MAX_REQ_REACHED,
		browser_action_launch: nAgentCoderAIAsk.BROWSER_ACTION_LAUNCH,
		use_mcp_server: nAgentCoderAIAsk.USE_MCP_SERVER,
		new_task: nAgentCoderAIAsk.NEW_TASK,
		condense: nAgentCoderAIAsk.CONDENSE,
		report_bug: nAgentCoderAIAsk.REPORT_BUG,
	}

	const result = mapping[ask]
	if (result === undefined) {
		console.warn(`Unknown nAgentCoderAIAsk value: ${ask}`)
	}
	return result
}

// Helper function to convert nAgentCoderAIAsk enum to string
function convertProtoEnumTonAgentCoderAIAsk(ask: nAgentCoderAIAsk): AppnAgentCoderAIAsk | undefined {
	if (ask === nAgentCoderAIAsk.UNRECOGNIZED) {
		console.warn("Received UNRECOGNIZED nAgentCoderAIAsk enum value")
		return undefined
	}

	const mapping: Record<Exclude<nAgentCoderAIAsk, nAgentCoderAIAsk.UNRECOGNIZED>, AppnAgentCoderAIAsk> = {
		[nAgentCoderAIAsk.FOLLOWUP]: "followup",
		[nAgentCoderAIAsk.PLAN_MODE_RESPOND]: "plan_mode_respond",
		[nAgentCoderAIAsk.COMMAND]: "command",
		[nAgentCoderAIAsk.COMMAND_OUTPUT]: "command_output",
		[nAgentCoderAIAsk.COMPLETION_RESULT]: "completion_result",
		[nAgentCoderAIAsk.TOOL]: "tool",
		[nAgentCoderAIAsk.API_REQ_FAILED]: "api_req_failed",
		[nAgentCoderAIAsk.RESUME_TASK]: "resume_task",
		[nAgentCoderAIAsk.RESUME_COMPLETED_TASK]: "resume_completed_task",
		[nAgentCoderAIAsk.MISTAKE_LIMIT_REACHED]: "mistake_limit_reached",
		[nAgentCoderAIAsk.AUTO_APPROVAL_MAX_REQ_REACHED]: "auto_approval_max_req_reached",
		[nAgentCoderAIAsk.BROWSER_ACTION_LAUNCH]: "browser_action_launch",
		[nAgentCoderAIAsk.USE_MCP_SERVER]: "use_mcp_server",
		[nAgentCoderAIAsk.NEW_TASK]: "new_task",
		[nAgentCoderAIAsk.CONDENSE]: "condense",
		[nAgentCoderAIAsk.REPORT_BUG]: "report_bug",
	}

	return mapping[ask]
}

// Helper function to convert nAgentCoderAISay string to enum
function convertnAgentCoderAISayToProtoEnum(say: AppnAgentCoderAISay | undefined): nAgentCoderAISay | undefined {
	if (!say) {
		return undefined
	}

	const mapping: Record<AppnAgentCoderAISay, nAgentCoderAISay> = {
		task: nAgentCoderAISay.TASK,
		error: nAgentCoderAISay.ERROR,
		api_req_started: nAgentCoderAISay.API_REQ_STARTED,
		api_req_finished: nAgentCoderAISay.API_REQ_FINISHED,
		text: nAgentCoderAISay.TEXT,
		reasoning: nAgentCoderAISay.REASONING,
		completion_result: nAgentCoderAISay.COMPLETION_RESULT_SAY,
		user_feedback: nAgentCoderAISay.USER_FEEDBACK,
		user_feedback_diff: nAgentCoderAISay.USER_FEEDBACK_DIFF,
		api_req_retried: nAgentCoderAISay.API_REQ_RETRIED,
		command: nAgentCoderAISay.COMMAND_SAY,
		command_output: nAgentCoderAISay.COMMAND_OUTPUT_SAY,
		tool: nAgentCoderAISay.TOOL_SAY,
		shell_integration_warning: nAgentCoderAISay.SHELL_INTEGRATION_WARNING,
		browser_action_launch: nAgentCoderAISay.BROWSER_ACTION_LAUNCH_SAY,
		browser_action: nAgentCoderAISay.BROWSER_ACTION,
		browser_action_result: nAgentCoderAISay.BROWSER_ACTION_RESULT,
		mcp_server_request_started: nAgentCoderAISay.MCP_SERVER_REQUEST_STARTED,
		mcp_server_response: nAgentCoderAISay.MCP_SERVER_RESPONSE,
		mcp_notification: nAgentCoderAISay.MCP_NOTIFICATION,
		use_mcp_server: nAgentCoderAISay.USE_MCP_SERVER_SAY,
		diff_error: nAgentCoderAISay.DIFF_ERROR,
		deleted_api_reqs: nAgentCoderAISay.DELETED_API_REQS,
		nagentcoderaiignore_error: nAgentCoderAISay.CLINEIGNORE_ERROR,
		checkpoint_created: nAgentCoderAISay.CHECKPOINT_CREATED,
		load_mcp_documentation: nAgentCoderAISay.LOAD_MCP_DOCUMENTATION,
		info: nAgentCoderAISay.INFO,
	}

	const result = mapping[say]
	if (result === undefined) {
		console.warn(`Unknown nAgentCoderAISay value: ${say}`)
	}
	return result
}

// Helper function to convert nAgentCoderAISay enum to string
function convertProtoEnumTonAgentCoderAISay(say: nAgentCoderAISay): AppnAgentCoderAISay | undefined {
	if (say === nAgentCoderAISay.UNRECOGNIZED) {
		console.warn("Received UNRECOGNIZED nAgentCoderAISay enum value")
		return undefined
	}

	const mapping: Record<Exclude<nAgentCoderAISay, nAgentCoderAISay.UNRECOGNIZED>, AppnAgentCoderAISay> = {
		[nAgentCoderAISay.TASK]: "task",
		[nAgentCoderAISay.ERROR]: "error",
		[nAgentCoderAISay.API_REQ_STARTED]: "api_req_started",
		[nAgentCoderAISay.API_REQ_FINISHED]: "api_req_finished",
		[nAgentCoderAISay.TEXT]: "text",
		[nAgentCoderAISay.REASONING]: "reasoning",
		[nAgentCoderAISay.COMPLETION_RESULT_SAY]: "completion_result",
		[nAgentCoderAISay.USER_FEEDBACK]: "user_feedback",
		[nAgentCoderAISay.USER_FEEDBACK_DIFF]: "user_feedback_diff",
		[nAgentCoderAISay.API_REQ_RETRIED]: "api_req_retried",
		[nAgentCoderAISay.COMMAND_SAY]: "command",
		[nAgentCoderAISay.COMMAND_OUTPUT_SAY]: "command_output",
		[nAgentCoderAISay.TOOL_SAY]: "tool",
		[nAgentCoderAISay.SHELL_INTEGRATION_WARNING]: "shell_integration_warning",
		[nAgentCoderAISay.BROWSER_ACTION_LAUNCH_SAY]: "browser_action_launch",
		[nAgentCoderAISay.BROWSER_ACTION]: "browser_action",
		[nAgentCoderAISay.BROWSER_ACTION_RESULT]: "browser_action_result",
		[nAgentCoderAISay.MCP_SERVER_REQUEST_STARTED]: "mcp_server_request_started",
		[nAgentCoderAISay.MCP_SERVER_RESPONSE]: "mcp_server_response",
		[nAgentCoderAISay.MCP_NOTIFICATION]: "mcp_notification",
		[nAgentCoderAISay.USE_MCP_SERVER_SAY]: "use_mcp_server",
		[nAgentCoderAISay.DIFF_ERROR]: "diff_error",
		[nAgentCoderAISay.DELETED_API_REQS]: "deleted_api_reqs",
		[nAgentCoderAISay.CLINEIGNORE_ERROR]: "nagentcoderaiignore_error",
		[nAgentCoderAISay.CHECKPOINT_CREATED]: "checkpoint_created",
		[nAgentCoderAISay.LOAD_MCP_DOCUMENTATION]: "load_mcp_documentation",
		[nAgentCoderAISay.INFO]: "info",
	}

	return mapping[say]
}

/**
 * Convert application nAgentCoderAIMessage to proto nAgentCoderAIMessage
 */
export function convertnAgentCoderAIMessageToProto(message: AppnAgentCoderAIMessage): ProtonAgentCoderAIMessage {
	// For sending messages, we need to provide values for required proto fields
	const askEnum = message.ask ? convertnAgentCoderAIAskToProtoEnum(message.ask) : undefined
	const sayEnum = message.say ? convertnAgentCoderAISayToProtoEnum(message.say) : undefined

	// Determine appropriate enum values based on message type
	let finalAskEnum: nAgentCoderAIAsk = nAgentCoderAIAsk.FOLLOWUP // Proto default
	let finalSayEnum: nAgentCoderAISay = nAgentCoderAISay.TEXT // Proto default

	if (message.type === "ask") {
		finalAskEnum = askEnum ?? nAgentCoderAIAsk.FOLLOWUP // Use FOLLOWUP as default for ask messages
	} else if (message.type === "say") {
		finalSayEnum = sayEnum ?? nAgentCoderAISay.TEXT // Use TEXT as default for say messages
	}

	const protoMessage: ProtonAgentCoderAIMessage = {
		ts: message.ts,
		type: message.type === "ask" ? nAgentCoderAIMessageType.ASK : nAgentCoderAIMessageType.SAY,
		ask: finalAskEnum,
		say: finalSayEnum,
		text: message.text ?? "",
		reasoning: message.reasoning ?? "",
		images: message.images ?? [],
		files: message.files ?? [],
		partial: message.partial ?? false,
		lastCheckpointHash: message.lastCheckpointHash ?? "",
		isCheckpointCheckedOut: message.isCheckpointCheckedOut ?? false,
		isOperationOutsideWorkspace: message.isOperationOutsideWorkspace ?? false,
		conversationHistoryIndex: message.conversationHistoryIndex ?? 0,
		conversationHistoryDeletedRange: message.conversationHistoryDeletedRange
			? {
					startIndex: message.conversationHistoryDeletedRange[0],
					endIndex: message.conversationHistoryDeletedRange[1],
				}
			: undefined,
	}

	return protoMessage
}

/**
 * Convert proto nAgentCoderAIMessage to application nAgentCoderAIMessage
 */
export function convertProtoTonAgentCoderAIMessage(protoMessage: ProtonAgentCoderAIMessage): AppnAgentCoderAIMessage {
	const message: AppnAgentCoderAIMessage = {
		ts: protoMessage.ts,
		type: protoMessage.type === nAgentCoderAIMessageType.ASK ? "ask" : "say",
	}

	// Convert ask enum to string
	if (protoMessage.type === nAgentCoderAIMessageType.ASK) {
		const ask = convertProtoEnumTonAgentCoderAIAsk(protoMessage.ask)
		if (ask !== undefined) {
			message.ask = ask
		}
	}

	// Convert say enum to string
	if (protoMessage.type === nAgentCoderAIMessageType.SAY) {
		const say = convertProtoEnumTonAgentCoderAISay(protoMessage.say)
		if (say !== undefined) {
			message.say = say
		}
	}

	// Convert other fields - preserve empty strings as they may be intentional
	if (protoMessage.text !== "") {
		message.text = protoMessage.text
	}
	if (protoMessage.reasoning !== "") {
		message.reasoning = protoMessage.reasoning
	}
	if (protoMessage.images.length > 0) {
		message.images = protoMessage.images
	}
	if (protoMessage.files.length > 0) {
		message.files = protoMessage.files
	}
	if (protoMessage.partial) {
		message.partial = protoMessage.partial
	}
	if (protoMessage.lastCheckpointHash !== "") {
		message.lastCheckpointHash = protoMessage.lastCheckpointHash
	}
	if (protoMessage.isCheckpointCheckedOut) {
		message.isCheckpointCheckedOut = protoMessage.isCheckpointCheckedOut
	}
	if (protoMessage.isOperationOutsideWorkspace) {
		message.isOperationOutsideWorkspace = protoMessage.isOperationOutsideWorkspace
	}
	if (protoMessage.conversationHistoryIndex !== 0) {
		message.conversationHistoryIndex = protoMessage.conversationHistoryIndex
	}

	// Convert conversationHistoryDeletedRange from object to tuple
	if (protoMessage.conversationHistoryDeletedRange) {
		message.conversationHistoryDeletedRange = [
			protoMessage.conversationHistoryDeletedRange.startIndex,
			protoMessage.conversationHistoryDeletedRange.endIndex,
		]
	}

	return message
}
