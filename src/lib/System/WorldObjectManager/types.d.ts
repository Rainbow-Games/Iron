// **OLD SYSTEM: PENDING REWORK**

/**
 * Manages all world objects in the game and makes new ones.
 */
export interface IWorldObjectManager {
	/**
	 * The Root folder to place world objects in.
	 */
	readonly root: Folder;

	/**
	 * Returns the data of an object with a given id.
	 * @param id The id of the object to get.
	 * @returns The objects data.
	 */
	get(id: number): IWorldObject<unknown> | undefined;

	/**
	 * Adds a world object to the manager.
	 * @param object The world object to add.
	 */
	add(object: IWorldObject<unknown>): void;

	/**
	 * Relocates the current object
	 * @param parent The parent to place the object under
	 * @param pos The position to move to
	 * @param r The rotation of the object on the Y axis / 90
	 */
	relocate(id: number, pos: Vector3, r: number): string;

	/**
	 * Removes a world object with a given id from the manager.
	 * @param id The id of the object to remove.
	 */
	destroy(id: number): void;

	/**
	 * Creates a world object of a given type.
	 * @param name The name of the world object type.
	 * @returns The id of the world object made.
	 */
	create(name: string): number;

	/**Initializes and starts the ticking of a world object.
	 * @param id The id of the WorldObject.
	 */
	initialize(id: number): void;
}
