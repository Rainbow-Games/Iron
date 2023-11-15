import { IState } from "../../StateManager/types";
import { Value } from "../../StateManager/value";

/**
 * World objects are objects players can place in the world.
 */
export interface IWorldObjectState extends IState {
	/**
	 * The position of the world object in [x, y, z, rotation(1-4)] format
	 */
	position: Value<number[] | undefined>;

	/**
	 * The object type as described in the TechTree.
	 */
	name: string;
}
