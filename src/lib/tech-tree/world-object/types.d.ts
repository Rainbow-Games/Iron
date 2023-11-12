import { Bin } from "../../bin";
import { ViewBase } from "../view";

/**Ticks and manages all world objects in the game */
export interface WorldObjectManagerInterface {
	/**where all the world objects are placed in the game */
	readonly root: Folder;
	/**
	 * gets a object with a given id
	 * @param id Id of the object
	 */
	get(id: number): ClonedWorldObjectInterface | undefined;
	/**
	 * Adds an objects data to the manager.
	 * @param object The object to add.
	 */
	add(object: ClonedWorldObjectInterface): void;
	/**
	 * Moves an object to a given location
	 * @param id The id of the object to move.
	 * @param pos The Vector3 position to move to
	 * @param r The rotation in increments of 90
	 */
	relocate(id: number, pos: Vector3, r: number): string;
	/**
	 * Creates a new object and adds it to the manager
	 * @param name The system name of the object type
	 */
	create(name: string): number;
}

/**World objects are objects players can place in the world. */
export interface ClonedWorldObjectInterface {
	/**The unique id of the object */
	readonly id: number;
	/**The Base of the object */
	readonly base: WorldObjectBase;
	/**The model cloned from the tech tree */
	readonly model: Model;
	/**variables for the world object to use */
	readonly vars: Map<string, Bin<unknown>>;
	/**Components of the world object */
	readonly components: Map<string, ClonedWorldObjectComponentInterface>;
	/**true if the object's components are functioning as normal */
	enabled: Bin<boolean>;
	/**Ticks on every frame */
	Tick(dt: number): void;
	/**Initialize the object and change component settings */
	Initialize(): void;
	/**function to run before destruction*/
	Destroy(): void;
}

/**World objects are objects players can place in the world. */
export interface WorldObjectBase {
	/**The view to open on interact */
	view: ViewBase | undefined;
	/**The system name for the object */
	name: string;
	/**The name the player sees */
	display: string;
	/**The discription the player sees */
	discription: string;
	/**The icon for the object */
	icon: string;
	/** The objects model */
	model: Model;
	/**Components attached by system name. */
	components: string[];
	/**Ticks on every frame */
	tick(dt: number, object: ClonedWorldObjectInterface): void;
	/**Initialize the object and change component settings */
	initialize(object: ClonedWorldObjectInterface): void;
	/**function to run before destruction*/
	destroy(object: ClonedWorldObjectInterface): void;
}

/**World object components are attached to world objects to add functionality. */
export interface ClonedWorldObjectComponentInterface {
	/**The base from the tech tre. */
	readonly base: WorldObjectComponentBase;
	/**Variables for the component to use. */
	readonly vars: Map<string, Bin<unknown>>;
	/**The world object the world object is linked to */
	readonly object: ClonedWorldObjectInterface;
	/**True if this component meets its needs set to false to diable the world object until needs are resolved. */
	enabled: Bin<boolean>;
	/**The status to show to the client. */
	status: Bin<string>;
	/**Ticks on every frame */
	Tick(dt: number): void;
	/**Initializes this component */
	Initialize(): void;
	/**Fires before world object destruction */
	Destroy(): void;
}

/**World object components are attached to world objects to add functionality. */
export interface WorldObjectComponentBase {
	/**The view to open on selection */
	view: ViewBase | undefined;
	/**The components system name */
	name: string;
	/**The name the player sees */
	display: string;
	/**The discription for the player */
	discription: string;
	/**The icon for the component */
	icon: string;
	/**Ticks on every frame */
	tick(dt: number, compoent: ClonedWorldObjectComponentInterface): void;
	/**Initializes this component */
	initialize(compoent: ClonedWorldObjectComponentInterface): void;
	/**Fires before world object destruction */
	destroy(compoent: ClonedWorldObjectComponentInterface): void;
}
