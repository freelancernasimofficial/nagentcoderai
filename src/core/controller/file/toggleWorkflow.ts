import { Controller } from ".."
import { Metadata } from "../../../shared/proto/common"
import { ToggleWorkflowRequest, NAgentRulesToggles } from "../../../shared/proto/file"
import { getWorkspaceState, updateWorkspaceState, getGlobalState, updateGlobalState } from "../../../core/storage/state"
import { NAgentRulesToggles as AppNAgentRulesToggles } from "../../../shared/nagent-rules"

/**
 * Toggles a workflow on or off
 * @param controller The controller instance
 * @param request The request containing the workflow path and enabled state
 * @returns The updated workflow toggles
 */
export async function toggleWorkflow(controller: Controller, request: ToggleWorkflowRequest): Promise<NAgentRulesToggles> {
	const { workflowPath, enabled, isGlobal } = request

	if (!workflowPath || typeof enabled !== "boolean") {
		console.error("toggleWorkflow: Missing or invalid parameters", {
			workflowPath,
			enabled: typeof enabled === "boolean" ? enabled : `Invalid: ${typeof enabled}`,
		})
		throw new Error("Missing or invalid parameters for toggleWorkflow")
	}

	// Update the toggles based on isGlobal flag
	if (isGlobal) {
		// Global workflows
		const toggles = ((await getGlobalState(controller.context, "globalWorkflowToggles")) as AppNAgentRulesToggles) || {}
		toggles[workflowPath] = enabled
		await updateGlobalState(controller.context, "globalWorkflowToggles", toggles)
		await controller.postStateToWebview()

		// Return the global toggles
		return NAgentRulesToggles.create({ toggles: toggles })
	} else {
		// Workspace workflows
		const toggles = ((await getWorkspaceState(controller.context, "workflowToggles")) as AppNAgentRulesToggles) || {}
		toggles[workflowPath] = enabled
		await updateWorkspaceState(controller.context, "workflowToggles", toggles)
		await controller.postStateToWebview()

		// Return the workspace toggles
		return NAgentRulesToggles.create({ toggles: toggles })
	}
}
