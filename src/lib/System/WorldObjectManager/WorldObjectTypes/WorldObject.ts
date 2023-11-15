import { EnumTree } from "../../../enum";
import { DefaultState } from "../../StateManager/defaultState";
import { Value } from "../../StateManager/value";
import { IWorldObjectState } from "./types";

/**
 * World objects are objects players can place in the world.
 */
export abstract class WorldObject<WorldObjectState extends IWorldObjectState> {
	/**
	 * The system name for the object
	 */
	name: string = "";

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
	 * The objects model
	 */
	abstract model: Model;

	/**
	 * The default state to use on object construction
	 */
	abstract defaultState: DefaultWorldObjectState;

	/**
	 * Function that runs when the object is placed
	 * @param state The state of the world object affected.
	 * @param placer The player or object that placed the object
	 * @returns A boolean that detemines if the placement will continue
	 */
	abstract initialize: (state: WorldObjectState, placer: Player | string) => boolean;

	/**
	 * Function that runs when the object is destroyed
	 * @param state The state of the world object affected.
	 * @param placer The player or object that destroyed the object
	 * @returns A boolean that detemines if the destruction will continue
	 */
	abstract destroy: (state: WorldObjectState, destructor: Player | string) => boolean;
}

export abstract class DefaultWorldObjectState extends DefaultState implements IWorldObjectState {
	/**
	 * The position of the world object in [x, y, z, rotation(1-4)] format
	 */
	position = new Value<number[] | undefined>(undefined);

	name: string;

	identifiers: [string | EnumTree.StateIdentifier] = [EnumTree.StateIdentifier.WorldObject];

	constructor(name: string) {
		super();
		this.name = name;
	}
}
