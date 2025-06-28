import { TogglenAgentCoderAIRules } from "../../../shared/proto/file"
import type { TogglenAgentCoderAIRuleRequest } from "../../../shared/proto/file"
import type { Controller } from "../index"
import { getGlobalState, getWorkspaceState, updateGlobalState, updateWorkspaceState } from "../../../core/storage/state"
import { NAgentRulesToggles as AppNAgentRulesToggles } from "@shared/nagent-rules"

/**
 * Toggles a nAgentCoderAI rule (enable or disable)
 * @param controller The controller instance
 * @param request The toggle request
 * @returns The updated nAgentCoderAI rule toggles
 */
export async function togglenAgentCoderAIRule(controller: Controller, request: TogglenAgentCoderAIRuleRequest): Promise<TogglenAgentCoderAIRules> {
	const { isGlobal, rulePath, enabled } = request

	if (!rulePath || typeof enabled !== "boolean" || typeof isGlobal !== "boolean") {
		console.error("togglenAgentCoderAIRule: Missing or invalid parameters", {
			rulePath,
			isGlobal: typeof isGlobal === "boolean" ? isGlobal : `Invalid: ${typeof isGlobal}`,
			enabled: typeof enabled === "boolean" ? enabled : `Invalid: ${typeof enabled}`,
		})
		throw new Error("Missing or invalid parameters for togglenAgentCoderAIRule")
	}

	// This is the same core logic as in the original handler
	if (isGlobal) {
		const toggles = ((await getGlobalState(controller.context, "globalNAgentRulesToggles")) as AppNAgentRulesToggles) || {}
		toggles[rulePath] = enabled
		await updateGlobalState(controller.context, "globalNAgentRulesToggles", toggles)
	} else {
		const toggles = ((await getWorkspaceState(controller.context, "localNAgentRulesToggles")) as AppNAgentRulesToggles) || {}
		toggles[rulePath] = enabled
		await updateWorkspaceState(controller.context, "localNAgentRulesToggles", toggles)
	}

	// Get the current state to return in the response
	const globalToggles = ((await getGlobalState(controller.context, "globalNAgentRulesToggles")) as AppNAgentRulesToggles) || {}
	const localToggles = ((await getWorkspaceState(controller.context, "localNAgentRulesToggles")) as AppNAgentRulesToggles) || {}

	return TogglenAgentCoderAIRules.create({
		globalNAgentRulesToggles: { toggles: globalToggles },
		localNAgentRulesToggles: { toggles: localToggles },
	})
}
