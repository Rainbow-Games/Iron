import { ReplicatedStorage, RunService } from "@rbxts/services";
import {
	ClientEventLink,
	ClientFunctionLink,
	RemoteEventLink,
	RemoteFunctionLink,
	ServerEventLink,
	ServerFunctionLink,
} from "./lib/links";

/**Iron, its in every factory game! */
namespace Iron {
	export const EventLink = (() => {
		if (RunService.IsServer()) {
			return new ServerEventLink();
		} else {
			return new ClientEventLink();
		}
	})();
	export const FunctionLink = (() => {
		if (RunService.IsServer()) {
			return new ServerFunctionLink();
		} else {
			return new ClientFunctionLink();
		}
	})();
	export function Initialize(root: Folder | undefined): void {
		if (RunService.IsClient()) {
			return warn("[Iron] You can only initialize from the server.");
		}
		if (!root) {
			root = new Instance("Folder");
			root.Name = "Name";
			root.Parent = ReplicatedStorage;
		}
		RemoteEventLink.Parent = root;
		RemoteFunctionLink.Parent = root;
	}
}

/**Export Iron itself */
export default Iron;

/**Export the TechTree Library */
export { TechTree } from "./lib/tech-tree";

/**Export the Bin Library */
export { Bin } from "./lib/bin";
