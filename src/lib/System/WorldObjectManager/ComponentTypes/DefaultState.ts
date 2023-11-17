import { EnumTree } from "../../../Enum";
import { DefaultState } from "../../StateManager/defaultState";
import { DefaultWorldObjectState } from "../WorldObjectTypes/DefaultState";
import { IState } from "../../StateManager/types";

export abstract class DefaultWorldObjectComponentState extends DefaultState implements IWorldObjectComponentState {
	identifiers: [string | EnumTree.StateIdentifier] = [EnumTree.StateIdentifier.WorldObjectComponent];

	name: string;

	getObject: () => DefaultWorldObjectState;

	constructor(name: string, getObject: () => DefaultWorldObjectState) {
		super();
		this.name = name;
		this.getObject = getObject;
	}
}

/**
 * World objects are objects players can place in the world.
 */
export interface IWorldObjectComponentState extends IState {
	getObject: () => DefaultWorldObjectState;
}
