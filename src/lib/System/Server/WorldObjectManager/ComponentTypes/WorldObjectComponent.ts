import { WorldObjectComponentState } from "./DefaultState";

export const DefaultWorldObjectComponent = {
	initialize: () => true,
	destroy: () => true,
};

/**
 * World objects are objects players can place in the world.
 */
export declare interface WorldObjectComponent<State extends WorldObjectComponentState> {
	/**
	 * The system name for the object
	 */
	name: string;

	/**
	 * The name the player sees
	 */
	display: string;

	/**
	 * The discription the player sees
	 */
	discription: string;

	/**
	 * The default state to use on object construction
	 */
	defaultState: State;

	/**
	 * Function that runs when the object is placed
	 * @param state The state of the world object affected.
	 * @param placer The player or object that placed the object
	 * @returns A boolean that detemines if the placement will continue
	 */
	initialize: (state: State, placer: Player | string) => boolean;

	/**
	 * Function that runs when the object is destroyed
	 * @param state The state of the world object affected.
	 * @param placer The player or object that destroyed the object
	 * @returns A boolean that detemines if the destruction will continue
	 */
	destroy: (state: State, destructor: Player | string) => boolean;
}
