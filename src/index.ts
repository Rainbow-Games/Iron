import { RunService, Workspace } from "@rbxts/services";

/**Exports the input library. */
export { InputManager, InputAction } from "./lib/systems/input";

/**Exports the event library. */
export { EventManager, Event } from "./lib/systems/event";

/**Exports the veiw library. */
export { ViewManager } from "./lib/tech-tree/view";

/**Exports the WorldObject library. */
export { WorldObjectManager } from "./lib/tech-tree/world-object";

/**Exports the TechTree library. */
export { TechTree } from "./lib/tech-tree";

/**Exports the Link library. */
export { Link } from "./lib/link";

namespace Iron {
	/**Initializes Iron's basic needs */
	export function Initialize() {
		if (RunService.IsClient()) return;
		const root = new Instance("Folder");
		root.Name = "@rbxts/iron";
		root.Parent = Workspace;
	}
}

/**Exports Iron's base function library. */
export default Iron;
