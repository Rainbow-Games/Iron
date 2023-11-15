/*********************************************************************\
|*|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|*|
|*|	File Summary:													|*|
|*|		The main entry way for the package.							|*|
|*|	Sections:														|*|
|*|	    - Imports: 		Things used in the Iron namespace.			|*|
|*|		- Iron:			The main namespace that houses all 			|*|
|*|						SystemManagers.								|*|
|*|		- Exports: 		Exports everything the developer will need	|*|
|*|						to utilize this package.					|*|
|*|_________________________________________________________________|*|
\*********************************************************************/

/*********************************************************************\
|*|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|*|
|*|	Imports:  Things used in the Iron namespace.					|*|
|*|_________________________________________________________________|*|
\*********************************************************************/

import { InputManager as InputManagerSingleton } from "./lib/systems/input-manager";

import { EventManager as EventManagerSingleton } from "./lib/systems/event-manager";

import { ViewManager as ViewManagerSingleton } from "./lib/systems/ViewManager";

import { WorldObjectManager as WorldObjectManagerSingleton } from "./lib/systems/WorldObjectManager";

import { TechTree as TechTreeSingleton } from "./lib/systems/tech-tree";

import { Link as LinkSingleton } from "./lib/systems/link";

import { EnumTree } from "./lib/enum";

/*********************************************************************\
|*|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|*|
|*|	Iron:  The main namespace that houses all SystemManagers.	    |*|
|*|_________________________________________________________________|*|
\*********************************************************************/

/**"Iron, it's in every factory game!" */
namespace Iron {
	/**The WorldObjectManager instance. */
	export const WorldObjectManager = WorldObjectManagerSingleton.getInstance();

	/**The TechTree instance. */
	export const TechTree = TechTreeSingleton.getInstance();

	/**The Link instance. */
	export const Link = LinkSingleton.getInstance();

	/**The ViewManager instance. */
	export const ViewManager = ViewManagerSingleton.getInstance();

	/**The EventManager instance. */
	export const EventManager = EventManagerSingleton.getInstance();

	/**The InputManager instance. */
	export const InputManager = InputManagerSingleton.getInstance();

	/**The Enum with all of Iron's static value types. */
	export const Enum = EnumTree;
}

/*********************************************************************\
|*|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|*|
|*|	Exports:  Exports everything the developer will need to 		|*|
|*|			  utilize this package.									|*|
|*|_________________________________________________________________|*|
\*********************************************************************/

// Exports the Iron namespace.
export default Iron;

// Exports the InputAction class for InputManager use.
export { InputAction } from "./lib/systems/input-manager";
