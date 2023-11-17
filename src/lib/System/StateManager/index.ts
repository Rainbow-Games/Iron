import { EnumTree } from "../../Enum";
import { IState, IStateManager } from "./types";

/**
 * Allows for easy access to all dynamic data of cloned TechTree objects.
 */
export class StateManager {
	private constructor() {}
	private static instance: IStateManager;
	static getInstance(): IStateManager {
		if (this.instance === undefined) this.instance = new StateManager();
		return this.instance;
	}

	private readonly StateContainer = new Array<IState>();

	private nextId = 0;

	/**
	 * Adds a state to the manager and returns its id.
	 * @param state The state to add.
	 * @returns The state added.
	 */
	add(state: IState): IState {
		state.id = this.nextId++;
		this.StateContainer.push(state);
		return state;
	}

	/**
	 * Gets a state by its id.
	 * @param id The id of the state to get.
	 * @returns The state with the provided id if any.
	 */
	getById(id: number): IState | undefined {
		return this.StateContainer.find((o) => o.id === id);
	}

	/**
	 * Gets states by there identifiers.
	 * @param identifiers Identifiers that are on the states to get.
	 * @returns The states with the provided identifiers if any.
	 */
	filterByIdentifiers(...identifiers: (string | EnumTree.StateIdentifier)[]): IState[] {
		let result: IState[] = this.StateContainer;
		for (const identifier of identifiers) {
			result = result.filter(
				(state) => state.identifiers.find((stateIdentifier) => stateIdentifier === identifier) !== undefined,
			);
			if (result === undefined) return [];
		}
		return result;
	}

	/**
	 * Removes a state bu its id.
	 * @param id The id of the state to remove.
	 */
	remove(id: number): void {
		this.StateContainer.remove(this.StateContainer.findIndex((state) => state.id === id));
	}
}
