import { EnumTree } from "../../../enum";
import { DefaultState } from "../../StateManager/defaultState";
import { DefaultWorldObjectState } from "../WorldObjectTypes/DefaultState";
import { IState } from "../../StateManager/types";

export abstract class DefaultWorldObjectComponentState extends DefaultState implements IWorldObjectComponentState {
	identifiers: [string | EnumTree.StateIdentifier] = [EnumTree.StateIdentifier.WorldObjectComponent];

	getObject: () => DefaultWorldObjectState;

	constructor(getObject: () => DefaultWorldObjectState) {
		super();
		this.getObject = getObject;
	}
}

/**
 * World objects are objects players can place in the world.
 */
export interface IWorldObjectComponentState extends IState {
	getObject: () => DefaultWorldObjectState;
}
