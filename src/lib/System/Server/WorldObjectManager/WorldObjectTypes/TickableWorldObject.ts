import { TickableWorldObjectState } from "./DefaultState";
import { DefaultWorldObject, WorldObject } from "./WorldObject";

export const DefaultTickableWorldObject = {
	...DefaultWorldObject,
	enabled: true,
	tick: () => {},
};

/**World objects are objects players can place in the world. */
export declare interface TickableWorldObject<State extends TickableWorldObjectState> extends WorldObject<State> {
	/**
	 * Function that runs to tick the object.
	 * @param state The state of the world object thats ticking.
	 * @param dt The delta time of the tick.
	 */
	tick: (dt: number, state: State) => void;

	/**
	 * If set to false the world object and all components wont work.
	 */
	enabled: boolean;
}
