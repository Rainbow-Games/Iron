import { OnlyServer, snowflake } from "../../utility";
import { Workspace } from "@rbxts/services";
import { TechTreeTypes, WorldObject, WorldObjectComponent } from "../t";
import { TechTree } from "..";
import {
	ClonedWorldObjectComponentInterface,
	ClonedWorldObjectInterface,
	WorldObjectBase,
	WorldObjectComponentBase,
	WorldObjectManagerInterface,
} from "./types";
import { Bin } from "../../bin";
import { t } from "@rbxts/t";
import { Link } from "../../link";

/**
 * Manages all world objects in the game and makes new ones.
 */
export class WorldObjectManager implements WorldObjectManagerInterface {
	private static instance: WorldObjectManager;
	static getInstance(): WorldObjectManager {
		if (!this.instance) this.instance = new WorldObjectManager();
		return this.instance;
	}
	/**how many ticks a second each world object gets */
	private tps: number;
	/**
	 * The Root folder to place world objects in.
	 */
	readonly root: Folder;
	/**
	 * The WorldObject container
	 */
	private readonly WorldObjects = new Map<number, ClonedWorldObject>();
	/**
	 * Returns the data of an object with a given id.
	 * @param id The id of the object to get.
	 * @returns The objects data.
	 */
	get(id: number): ClonedWorldObject | undefined {
		return this.WorldObjects.get(id);
	}
	/**
	 * Adds a world object to the manager.
	 * @param object The world object to add.
	 */
	add(object: ClonedWorldObject): void {
		this.WorldObjects.set(object.id, object);
	}
	/**
	 * Relocates the current object
	 * @param parent The parent to place the object under
	 * @param pos The position to move to
	 * @param r The rotation of the object on the Y axis / 90
	 */
	relocate(id: number, pos: Vector3, r: number): string {
		const object = this.get(id);
		if (object === undefined) return `Object ID:${id} does not exist!`;
		object.model.Name = tostring(object.id);
		object.model.Parent = this.root;
		object.model.MoveTo(pos);
		object.model.WorldPivot = new CFrame(object.model.WorldPivot.Position, new Vector3(0, r * 90, 0));
		return `Moved ${object.base.display} to ${object.model.WorldPivot.Position}!`;
	}
	/**
	 * Removes a world object with a given id from the manager.
	 * @param id The id of the object to remove.
	 */
	destroy(id: number): void {
		const object = this.get(id);
		if (!object) return;
		task.spawn(() => object.Destroy());
		this.WorldObjects.delete(id);
	}
	/**
	 * Creates a world object of a given type.
	 * @param name The name of the world object type.
	 * @returns The id of the world object made.
	 */
	create(name: string): number {
		const base = TechTree.getInstance().get(TechTreeTypes.WorldObject, name);
		if (!WorldObject(base)) {
			return 0;
		}
		const object = new ClonedWorldObject(base as WorldObjectBase);
		this.add(object);
		return object.id;
	}

	/**Initializes and starts the ticking of a world object.
	 * @param id The id of the WorldObject.
	 */
	initialize(id: number): void {
		const object = this.get(id);
		if (!object) return;
		task.spawn(() => object.Initialize());
	}
	/**
	 * Defines all the starting variables.
	 * @param root The folder where all objects are placed.
	 */
	private constructor() {
		this.root = new Instance("Folder");
		this.root.Name = "WorldObjects";
		this.root.Parent = Workspace.WaitForChild("@rbxts/iron");
		this.tps = 20;
		Link.getInstance().setCallback(Link.getInstance().InternalCommands.GetObjectById, (player, id) => {
			print(id);
			if (!t.number(id)) return;
			return this.get(id);
		});
		task.delay(1 / this.tps, () => this.Tick(os.clock()));
	}
	/**
	 * Ticks all world objects once per defined frame.
	 */
	private Tick(lastTick: number) {
		const dt = os.clock() - lastTick;
		lastTick = os.clock();
		for (const [_, object] of this.WorldObjects) {
			task.spawn(() => object.Tick(dt));
		}
		task.delay(1 / this.tps - (os.clock() - lastTick) - 0.01, () => this.Tick(lastTick));
	}
}

/**A world object cloned from the tech tree. */
export class ClonedWorldObject implements ClonedWorldObjectInterface {
	/**doTick? */
	private initialized = false;
	/**The unique id of the object. */
	readonly id: number = snowflake();
	/**The objects data that is static. */
	readonly base: WorldObjectBase;
	/**The cloned model of the object for displaying in world. */
	readonly model: Model;
	/**The dynamic data for the object. */
	readonly vars = new Map<string, Bin<unknown>>();
	/**Components */
	readonly components = new Map<string, ClonedWorldObjectComponent>();
	/**True if all components are functioning as needed. */
	enabled = new Bin<boolean>(true);
	/**Updates enabled status */
	private updateEnabled(value: boolean | undefined) {
		if (value === false) {
			this.enabled.set(false);
			return;
		} else {
			for (const [_, compoent] of this.components) {
				if (compoent.enabled.get() === true) continue;
				this.enabled.set(false);
				return;
			}
			this.enabled.set(true);
			return;
		}
	}
	/**Cretaes compoents and sets up the object. */
	constructor(base: WorldObjectBase) {
		this.base = base;
		this.model = this.base.model.Clone();
		for (const c of this.base.components) {
			const component = TechTree.getInstance().get(TechTreeTypes.WorldObjectComponent, c);
			if (!WorldObjectComponent(component)) {
				continue;
			}
			const com = new ClonedWorldObjectComponent(component as WorldObjectComponentBase, this);
			this.components.set(component.name, com);
			com.enabled.changed.connect((value) => this.updateEnabled(value));
		}
		this.enabled.set(true);
	}
	/**Runs on every frame to update the object. */
	Tick(dt: number) {
		if (!this.initialized) return;
		this.base.tick(dt, this);
		for (const [_, component] of this.components) {
			component.Tick(dt);
		}
	}
	/**Runs when the object is placed in the world for the first time. */
	Initialize() {
		if (this.initialized) return;
		this.base.initialize(this);
		for (const [_, component] of this.components) {
			component.Initialize();
		}
		this.initialized = true;
	}
	/**Runs when the object is deconstructed. */
	Destroy() {
		this.base.destroy(this);
		for (const [_, component] of this.components) {
			component.Destroy();
		}
		this.model.Destroy();
	}
}

/**A active component cloned from the TechTree */
export class ClonedWorldObjectComponent implements ClonedWorldObjectComponentInterface {
	/**The static data from the tech tree. */
	readonly base: WorldObjectComponentBase;
	/**The dynamic variables for the component. */
	readonly vars = new Map<string, Bin<unknown>>();
	/** the linked world object */
	readonly object: ClonedWorldObject;
	/**The components status to show to the client. */
	status = new Bin<string>("Enabled.");
	/**True if the component is functioning as needed. */
	enabled = new Bin<boolean>(true);
	/**Sets initial values and returns a new instance of this component. */
	constructor(base: WorldObjectComponentBase, object: ClonedWorldObject) {
		this.base = base;
		this.object = object;
		this.enabled.set(true);
	}
	/**Ticks on every frame to update the component. */
	Tick(dt: number) {
		this.base.tick(dt, this);
	}
	/**Runs when the connected world object is initialized. */
	Initialize() {
		this.base.initialize(this);
	}
	/**Runs when the connected world object is destroyed. */
	Destroy() {
		this.base.destroy(this);
	}
}
