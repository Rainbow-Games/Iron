import { DefaultState } from "../../StateManager/defaultState";
import { Value } from "../../StateManager/value";
import { IWorldObjectState } from "./types";
import { EnumTree } from "../../../enum";

export abstract class DefaultWorldObjectState extends DefaultState implements IWorldObjectState {
	/**
	 * The position of the world object in [x, y, z, rotation(1-4)] format
	 */
	position = new Value<number[] | undefined>(undefined);

	name: string;

	identifiers: [string | EnumTree.StateIdentifier] = [EnumTree.StateIdentifier.WorldObject];

	getComponent: <T>() => T;

	constructor(name: string, getComponent: <T>() => T) {
		super();
		this.name = name;
		this.getComponent = getComponent;
	}
}
