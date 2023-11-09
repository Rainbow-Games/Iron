import { RunService } from "@rbxts/services";
import { WorldObjectManagerClass } from "./lib/tech-tree/world-object";
import { createBroadcastReceiver, createBroadcaster } from "@rbxts/reflex";
import { slices } from "./lib/slices";
import { remotes } from "./lib/remotes";

namespace Iron {
	export let WorldObjectManager: WorldObjectManagerClass;
	export function Initialize(props: IronSettings) {
		if (RunService.IsServer()) {
			Iron.WorldObjectManager = new WorldObjectManagerClass(props.RootWorldObjectLocation, props.FPS);
			const broadcaster = createBroadcaster({
				producers: slices,
				dispatch: (player, actions) => {
					remotes.dispatch.fire(player, actions);
				},
				hydrateRate: 1 / props.FPS,
			});
			remotes.start.connect((player) => {
				broadcaster.start(player);
			});

			slices.PlayerGuis.applyMiddleware(broadcaster.middleware);
		} else {
			const reciver = createBroadcastReceiver({
				start: () => {
					remotes.start.fire();
				},
			});
			remotes.dispatch.connect((actions) => {
				reciver.dispatch(actions);
			});
			slices.PlayerGuis.applyMiddleware(reciver.middleware);
		}
	}
}

/**Export Iron itself. */
export default Iron;

/**Export the TechTree library. */
export { TechTree } from "./lib/tech-tree";

/**Export the state. */
export { slices } from "./lib/slices";
