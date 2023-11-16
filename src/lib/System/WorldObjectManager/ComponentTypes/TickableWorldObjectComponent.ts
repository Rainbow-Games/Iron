import { EnumTree } from "../../../enum";
import { DefaultWorldObjectState } from "../WorldObjectTypes/DefaultState";
import { DefaultWorldObjectComponentState } from "./DefaultState";
import { WorldObjectComponent } from "./WorldObjectComponent";

/**World objects are objects players can place in the world. */
export abstract class TickableWorldObjectComponent<
	T extends DefaultWorldObjectComponentState,
> extends WorldObjectComponent<T> {
	/**
	 * Function that runs to tick the object.
	 * @param state The state of the world object thats ticking.
	 * @param dt The delta time of the tick.
	 */
	abstract tick: (state: T, dt: number) => void;
}

/**World objects are objects players can place in the world. */
export abstract class DefaultTickableWorldObjectComponentState extends DefaultWorldObjectComponentState {
	/**
	 * starts object ticking.
	 */
	constructor(getObject: () => DefaultWorldObjectState) {
		super(getObject);
		this.identifiers.push(EnumTree.StateIdentifier.Tickable);
	}
}
