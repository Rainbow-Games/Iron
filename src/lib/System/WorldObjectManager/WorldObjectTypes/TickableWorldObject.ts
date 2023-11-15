import { EnumTree } from "../../../enum";
import { WorldObject, DefaultWorldObjectState } from "./WorldObject";
import { IWorldObjectState } from "./types";

/**World objects are objects players can place in the world. */
export abstract class TickableWorldObject<ObjectState extends IWorldObjectState> extends WorldObject<ObjectState> {
	/**
	 * Function that runs to tick the object.
	 * @param state The state of the world object thats ticking.
	 * @param dt The delta time of the tick.
	 */
	abstract tick: (state: ObjectState, dt: number) => void;
}

/**World objects are objects players can place in the world. */
export abstract class DefaultTickableWorldObjectState extends DefaultWorldObjectState {
	/**
	 * starts object ticking.
	 */
	constructor(name: string) {
		super(name);
		this.identifiers.push(EnumTree.StateIdentifier.Tickable);
	}
}
