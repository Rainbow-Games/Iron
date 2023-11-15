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
	filterByIdentifiers(identifiers: string[]): IState[] | undefined;

	/**
	 * Removes a state bu its id.
	 * @param id The id of the state to remove.
	 */
	remove(id: number): void;
}

export interface IState {
	id: number;
	identifiers: string[];
}
