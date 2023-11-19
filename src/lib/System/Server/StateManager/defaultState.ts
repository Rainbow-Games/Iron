import { IState } from "./types";

/**
 * Stores dynamic data for easy access from anywhere.
 */
export const DefaultState: IState = {
	id: 0,

	/**
	 * Identifiers that can be used to filter States in the State Manager
	 */
	identifiers: [],
};
