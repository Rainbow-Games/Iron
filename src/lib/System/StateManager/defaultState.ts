import { EnumTree } from "../../enum";
import { IState } from "./types";

/**
 * Stores dynamic data for easy access from anywhere.
 */
export abstract class DefaultState implements IState {
	id = 0;

	/**
	 * Identifiers that can be used to filter States in the State Manager
	 */
	abstract identifiers: [string | EnumTree.StateIdentifier];
}
