import { EnumTree } from "../../Enum";
import { IEvent } from "../EventManager/types";

export interface IStateManager {
	/**
	 * Adds a state to the manager and returns its id.
	 * @param state The state to add.
	 * @returns The state added.
	 */
	add(state: IState): IState;

	/**
	 * Gets a state by its id.
	 * @param id The id of the state to get.
	 * @returns The state with the provided id if any.
	 */
	getById(id: number): IState | undefined;

	/**
	 * Gets states by there identifiers.
	 * @param identifiers Identifiers that are on the states to get.
	 * @returns The states with the provided identifiers if any.
	 */
	filterByIdentifiers(...identifiers: (string | EnumTree.StateIdentifier)[]): IState[];

	/**
	 * Removes a state bu its id.
	 * @param id The id of the state to remove.
	 */
	remove(id: number): void;
}

/**
 * Stores dynamic data for easy access from anywhere.
 */
export interface IState {
	id: number;

	/**
	 * Identifiers that can be used to filter States in the State Manager
	 */
	identifiers: [string | EnumTree.StateIdentifier];
}

export interface IValue<T> {
	/**
	 * Saves value on serialization if enabled.
	 */
	Serialized: boolean;

	set(value: T): void;

	get(): T;

	changed: IEvent;
}
