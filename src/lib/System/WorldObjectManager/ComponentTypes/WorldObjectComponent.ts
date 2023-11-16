import { DefaultWorldObjectComponentState } from "./DefaultState";

/**
 * World objects are objects players can place in the world.
 */
export abstract class WorldObjectComponent<T extends DefaultWorldObjectComponentState> {
	/**
	 * The system name for the object
	 */
	abstract name: string;

	/**
	 * The name the player sees
	 */
	abstract display: string;

	/**
	 * The discription the player sees
	 */
	abstract discription: string;

	/**
	 * The icon for the object
	 */
	abstract icon: string;

	/**
	 * The default state to use on object construction
	 */
	abstract defaultState: T;

	/**
	 * Function that runs when the object is placed
	 * @param state The state of the world object affected.
	 * @param placer The player or object that placed the object
	 * @returns A boolean that detemines if the placement will continue
	 */
	abstract initialize: (state: T, placer: Player | string) => boolean;

	/**
	 * Function that runs when the object is destroyed
	 * @param state The state of the world object affected.
	 * @param placer The player or object that destroyed the object
	 * @returns A boolean that detemines if the destruction will continue
	 */
	abstract destroy: (state: T, destructor: Player | string) => boolean;
}
