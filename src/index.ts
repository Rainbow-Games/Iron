import { InputManager as InputManagerSingleton } from "./lib/System/InputManager";

import { EventManager as EventManagerSingleton } from "./lib/System/EventManager";

import { ServerManager as ServerManagerSingleton } from "./lib/System/SeverManager";

import { TechTree as TechTreeSingleton } from "./lib/System/TechTree";

import { Console as console } from "./lib/Utility/console";

import { StateManager as StateManagerSingleton } from "./lib/System/StateManager";

import { Config as ConfigSingleton } from "./lib/System/Config";

import { TickManager as TickManagerSingleton } from "./lib/System/TickManager";

/**"Iron, it's in every factory game!" */
namespace Iron {
	/**The EventManager instance. */
	export const EventManager = EventManagerSingleton.getInstance();

	/**The InputManager instance. */
	export const InputManager = InputManagerSingleton.getInstance();

	/**The ServerManager instance */
	export const ServerManager = ServerManagerSingleton.getInstance();

	/**TechTree houses all availible instances and their default states. */
	export const TechTree = TechTreeSingleton.getInstance();

	/**The state manager houses all states and can search add and remove them by id or identifiers. */
	export const StateManager = StateManagerSingleton.getInstance();

	/**Allows for central ticking of anything that ticks also allows you to pause or change tick speed. */
	export const TickManager = TickManagerSingleton.getInstance();

	/**Prints lines to the console and can create debug packets. */
	export const Console = console;

	/**Configure Iron here. */
	export const Config = ConfigSingleton;
}

// Exports the Iron namespace.
export default Iron;

// Exports the InputAction class for InputManager use.
export { InputAction } from "./lib/System/InputManager/inputAction";

export { IronConfig } from "./lib/System/Config/types";

// Exports all types of World Objects
export { WorldObject } from "./lib/System/WorldObjectManager/WorldObjectTypes/WorldObject";
export { TickableWorldObject } from "./lib/System/WorldObjectManager/WorldObjectTypes/TickableWorldObject";

// Exports all types of World Object Components
export { WorldObjectComponent } from "./lib/System/WorldObjectManager/ComponentTypes/WorldObjectComponent";
export { TickableWorldObjectComponent } from "./lib/System/WorldObjectManager/ComponentTypes/TickableWorldObjectComponent";
