import path from "path"
import { ensureRulesDirectoryExists, GlobalFileNames } from "@core/storage/disk"
import { fileExistsAtPath, isDirectory, readDirectory } from "@utils/fs"
import { formatResponse } from "@core/prompts/responses"
import fs from "fs/promises"
import { NAgentRulesToggles } from "@shared/nagent-rules"
import { getGlobalState, getWorkspaceState, updateGlobalState, updateWorkspaceState } from "@core/storage/state"
import * as vscode from "vscode"
import { synchronizeRuleToggles, getRuleFilesTotalContent } from "@core/context/instructions/user-instructions/rule-helpers"

export const getGlobalNAgentRules = async (globalNAgentRulesFilePath: string, toggles: NAgentRulesToggles) => {
	if (await fileExistsAtPath(globalNAgentRulesFilePath)) {
		if (await isDirectory(globalNAgentRulesFilePath)) {
			try {
				const rulesFilePaths = await readDirectory(globalNAgentRulesFilePath)
				const rulesFilesTotalContent = await getRuleFilesTotalContent(rulesFilePaths, globalNAgentRulesFilePath, toggles)
				if (rulesFilesTotalContent) {
					const nagentRulesFileInstructions = formatResponse.nagentRulesGlobalDirectoryInstructions(
						globalNAgentRulesFilePath,
						rulesFilesTotalContent,
					)
					return nagentRulesFileInstructions
				}
			} catch {
				console.error(`Failed to read .nagentrules directory at ${globalNAgentRulesFilePath}`)
			}
		} else {
			console.error(`${globalNAgentRulesFilePath} is not a directory`)
			return undefined
		}
	}

	return undefined
}

export const getLocalNAgentRules = async (cwd: string, toggles: NAgentRulesToggles) => {
	const nagentRulesFilePath = path.resolve(cwd, GlobalFileNames.nagentRules)

	let nagentRulesFileInstructions: string | undefined

	if (await fileExistsAtPath(nagentRulesFilePath)) {
		if (await isDirectory(nagentRulesFilePath)) {
			try {
				const rulesFilePaths = await readDirectory(nagentRulesFilePath, [[".nagentrules", "workflows"]])

				const rulesFilesTotalContent = await getRuleFilesTotalContent(rulesFilePaths, cwd, toggles)
				if (rulesFilesTotalContent) {
					nagentRulesFileInstructions = formatResponse.nagentRulesLocalDirectoryInstructions(cwd, rulesFilesTotalContent)
				}
			} catch {
				console.error(`Failed to read .nagentrules directory at ${nagentRulesFilePath}`)
			}
		} else {
			try {
				if (nagentRulesFilePath in toggles && toggles[nagentRulesFilePath] !== false) {
					const ruleFileContent = (await fs.readFile(nagentRulesFilePath, "utf8")).trim()
					if (ruleFileContent) {
						nagentRulesFileInstructions = formatResponse.nagentRulesLocalFileInstructions(cwd, ruleFileContent)
					}
				}
			} catch {
				console.error(`Failed to read .nagentrules file at ${nagentRulesFilePath}`)
			}
		}
	}

	return nagentRulesFileInstructions
}

export async function refreshNAgentRulesToggles(
	context: vscode.ExtensionContext,
	workingDirectory: string,
): Promise<{
	globalToggles: NAgentRulesToggles
	localToggles: NAgentRulesToggles
}> {
	// Global toggles
	const globalNAgentRulesToggles = ((await getGlobalState(context, "globalNAgentRulesToggles")) as NAgentRulesToggles) || {}
	const globalNAgentRulesFilePath = await ensureRulesDirectoryExists()
	const updatedGlobalToggles = await synchronizeRuleToggles(globalNAgentRulesFilePath, globalNAgentRulesToggles)
	await updateGlobalState(context, "globalNAgentRulesToggles", updatedGlobalToggles)

	// Local toggles
	const localNAgentRulesToggles = ((await getWorkspaceState(context, "localNAgentRulesToggles")) as NAgentRulesToggles) || {}
	const localNAgentRulesFilePath = path.resolve(workingDirectory, GlobalFileNames.nagentRules)
	const updatedLocalToggles = await synchronizeRuleToggles(localNAgentRulesFilePath, localNAgentRulesToggles, "", [
		[".nagentrules", "workflows"],
	])
	await updateWorkspaceState(context, "localNAgentRulesToggles", updatedLocalToggles)

	return {
		globalToggles: updatedGlobalToggles,
		localToggles: updatedLocalToggles,
	}
}
