import { EnumTree } from "../../../../Enum";
import { DefaultState } from "../../StateManager/defaultState";

export const DefaultWorldObjectComponentState = {
	...DefaultState,

	identifiers: [EnumTree.StateIdentifier.WorldObjectComponent],

	enabled: true,

	objectId: -1,

	status: "System Operational.",

	initialized: false,
};

export const DefaultTickableWorldObjectComponentState = {
	...DefaultWorldObjectComponentState,
	identifiers: [EnumTree.StateIdentifier.Tickable, EnumTree.StateIdentifier.WorldObjectComponent],
};

export declare interface WorldObjectComponentState {
	/**
	 * Identifiers for the StateManager to use.
	 */
	identifiers: (string | EnumTree.StateIdentifier)[];

	/**
	 * The name of the components base.
	 */
	name: string;

	/**
	 * The ID of the world object.
	 */
	objectId: number;

	/**
	 * If this becomes false the entire WorldObject will turn off.
	 */
	enabled: boolean;

	/**
	 * The components status for communicating problems to the player.
	 */
	status: string;

	/**
	 * Sets to true after initialization. (allows tick)
	 */
	initialized: boolean;
}

/**World objects are objects players can place in the world. */
export declare interface TickableWorldObjectComponentState extends WorldObjectComponentState {}
