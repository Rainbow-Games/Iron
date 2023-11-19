import { TickableWorldObjectComponentState } from "./DefaultState";
import { DefaultWorldObjectComponent, WorldObjectComponent } from "./WorldObjectComponent";

export const DefaultTickableWorldObjectComponent = {
	...DefaultWorldObjectComponent,
};

/**World object components are things that extend functionality of world objects. */
export declare interface TickableWorldObjectComponent<State extends TickableWorldObjectComponentState>
	extends WorldObjectComponent<State> {
	/**
	 * Function that runs to tick the component.
	 * @param state The state of the component thats ticking.
	 * @param dt The delta time of the tick.
	 */
	tick: (dt: number, state: State) => void;
}
