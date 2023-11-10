import { RunService } from "@rbxts/services";
import { WorldObjectManagerClass } from "./lib/tech-tree/world-object";
import { NetLink } from "./lib/net";

namespace Iron {
	export let WorldObjectManager: WorldObjectManagerClass;
	export const Link = new NetLink();
	export function Initialize(props: IronSettings) {
		if (RunService.IsServer()) {
			Iron.WorldObjectManager = new WorldObjectManagerClass(props.RootWorldObjectLocation, props.FPS);
		}
	}
}

/**Export Iron itself. */
export default Iron;

/**Export the TechTree library. */
export { TechTree } from "./lib/tech-tree";
