import { DefaultState } from "../../StateManager/defaultState";
import { EnumTree } from "../../../../Enum";

export const DefaultWorldObjectState = {
	...DefaultState,

	identifiers: [EnumTree.StateIdentifier.WorldObject],

	model: undefined,

	name: "",

	components: [],

	initialized: false,
};

/**
 * The state of a world object holds any data that is not static.
 */
export declare interface WorldObjectState {
	/**
	 * A unique snowflake id.
	 */
	id: number;

	/**
	 * Identifiers for the state manager to use.
	 */
	identifiers: (EnumTree.StateIdentifier | string)[];

	/**
	 * The name of the base object.
	 */
	name: string;

	/**
	 * The in world model of the object if any.
	 */
	model: undefined | Model;

	/**
	 * The snowflake id's of all components linked to this object.
	 */
	components: number[];

	/**
	 * Sets to true after initialization. (allows tick)
	 */
	initialized: boolean;
}

/**World objects are objects players can place in the world. */
export const DefaultTickableWorldObjectState = {
	...DefaultWorldObjectState,
	identifiers: [EnumTree.StateIdentifier.Tickable, EnumTree.StateIdentifier.WorldObject],
	enabled: true,
};

export declare interface TickableWorldObjectState extends WorldObjectState {
	enabled: boolean;
}
