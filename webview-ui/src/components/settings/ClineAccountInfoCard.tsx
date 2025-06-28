import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { useFirebaseAuth } from "@/context/FirebaseAuthContext"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { AccountServiceClient } from "@/services/grpc-client"
import { EmptyRequest } from "@shared/proto/common"

export const nAgentCoderAIAccountInfoCard = () => {
	const { user: firebaseUser, handleSignOut } = useFirebaseAuth()
	const { userInfo, apiConfiguration, navigateToAccount } = useExtensionState()

	let user = apiConfiguration?.nagentcoderaiApiKey ? firebaseUser || userInfo : undefined

	const handleLogin = () => {
		AccountServiceClient.accountLoginClicked(EmptyRequest.create()).catch((err) =>
			console.error("Failed to get login URL:", err),
		)
	}

	const handleShowAccount = () => {
		navigateToAccount()
	}

	return (
		<div className="max-w-[600px]">
			{user ? (
				<VSCodeButton appearance="secondary" onClick={handleShowAccount}>
					View Billing & Usage
				</VSCodeButton>
			) : (
				<div>
					<VSCodeButton onClick={handleLogin} className="mt-0">
						Sign Up with nAgentCoderAI
					</VSCodeButton>
				</div>
			)}
		</div>
	)
}
