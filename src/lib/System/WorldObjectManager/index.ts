import { EnumTree } from "../../enum";
import { RunsOn } from "../../utility/decorators";
import { IWorldObjectManager } from "./types";

/**
 * Manages all world objects in the game and makes new ones.
 */
export class WorldObjectManager implements IWorldObjectManager {
	private static instance: WorldObjectManager;

	@RunsOn(EnumTree.RunType.Server)
	static getInstance(): WorldObjectManager {
		if (!this.instance) this.instance = new WorldObjectManager();
		return this.instance;
	}

	/**how many ticks a second each world object gets */
	private tps: number = 20;

	/**
	 * The Root folder to place world objects in.
	 */
	readonly root: Folder = new Instance("Folder");

	/**
	 * The WorldObject container
	 */
	private readonly WorldObjects = new Map<number, IWorldObject>();

	/**
	 * Returns the data of an object with a given id.
	 * @param id The id of the object to get.
	 * @returns The objects data.
	 */
	get(id: number): IWorldObject | undefined {
		return this.WorldObjects.get(id);
	}

	/**
	 * Adds a world object to the manager.
	 * @param object The world object to add.
	 */
	add(object: IWorldObject): void {
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
		const object = new ClonedWorldObject(base as IWorldObjectState);
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
		const root = new Instance("Folder");
		root.Name = "@rbxts/iron";
		root.Parent = Workspace;
		this.root = new Instance("Folder");
		this.root.Name = "WorldObjects";
		this.root.Parent = root;
		this.tps = 20;
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
