import { StateManager } from ".";
import { IState } from "./types";

export abstract class State implements IState {
	id: number = -1;
	identifiers: string[] = [];
	constructor() {
		StateManager.getInstance();
	}
}
