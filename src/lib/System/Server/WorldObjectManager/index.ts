import { Workspace } from "@rbxts/services";
import { TechTree } from "../../Shared/TechTree";
import { EnumTree } from "../../../Enum";
import types from "../../../Type/techTree";
import { Console } from "../../../Utility/console";
import { StateManager } from "../StateManager";
import { WorldObjectState } from "./WorldObjectTypes/DefaultState";
import { WorldObject } from "./WorldObjectTypes/WorldObject";
import { AssetManager } from "../AssetManager";
import { WorldObjectModelAsset } from "../../Shared/AssetTypes/worldObjectModel";
import { Config } from "../../Shared/Config";
import { Link } from "../Network";
import { t } from "@rbxts/t";

namespace Errors {
	export function NoObjectFoundWithId(id: number) {
		return `Could not find object with ID #${id}.`;
	}
	export function CannotCreateObjectNotOnTechTree(name: string) {
		return `Could not create an object with name of "${name}". Missing from tech tree.`;
	}
	export function CannotDestroyObjectNotOnTechTree(name: string) {
		return `Could not destroy an object with name of "${name}". Missing from tech tree.`;
	}
	export function ObjectInitializeFailed(id: number, err: string | undefined) {
		return `Could not initialize object with ID #${id}. ${err !== undefined ? err : ""}`;
	}
}

export class WorldObjectManager {
	private root: Folder = new Instance("Folder");
	private constructor() {
		this.root.Name = "WorldObjects";
		this.root.Parent = Workspace.FindFirstChild("@rbxts/iron");
		this.log.Log("Iron.WorldObjectManager has initialized without error.", "Iron.WorldObjectManager");
		const Packet = t.interface({
			name: t.string,
			pos: t.array(t.number),
		});
		this.link.setCallback((player, packet) => {
			if (!Packet(packet)) return;
			this.create(packet.name, packet.pos as [number, number, number, number], player);
		});
		this.link.event.Connect((player, packet) => {
			this.destroy(packet as number, player);
		});
	}
	private static instance: WorldObjectManager;
	private StateManager = StateManager.getInstance();
	private link = new Link("Placement");
	readonly log = Console.Debug("Iron.WorldObjectManager");

	static getInstance(): WorldObjectManager {
		if (this.instance === undefined) this.instance = new WorldObjectManager();
		return this.instance;
	}

	/**
	 * Gets a world objects state by its id.
	 * @param id The id of the world object to get.
	 * @returns The state of the world object.
	 */
	get(id: number): WorldObjectState | undefined {
		const object = this.StateManager.getById(id);
		if (object === undefined || object.identifiers.indexOf(EnumTree.StateIdentifier.WorldObject) === -1) {
			this.log.Warn(Errors.NoObjectFoundWithId(id), "Iron.WorldObjectManager.get()");
			return undefined;
		}
		return object as WorldObjectState;
	}

	/**
	 * Creates a new world object from its base in the tech tree.
	 * @param name The type of the world object to create.
	 * @param position The position to place the world object in [x, y, z, rotation index] format.
	 * @param placer The player who placed it or string for systems.
	 * @returns The new world objects state.
	 */
	create(
		name: string,
		position: [number, number, number, number],
		placer: string | Player,
	): WorldObjectState | undefined {
		const base = TechTree.getInstance().get(name) as WorldObject<WorldObjectState>;
		if (base === undefined || !types.WorldObject(base)) {
			this.log.Warn(Errors.CannotCreateObjectNotOnTechTree(name), "Iron.WorldObjectManager.create()");
			return undefined;
		}
		const object = { ...base.defaultState };
		const asset = AssetManager.getInstance().getAsset(EnumTree.AssetType.WorldObjectModel, base.name) as
			| WorldObjectModelAsset
			| undefined;
		object.model = asset?.source ? asset?.source.Clone() : Config.getInstance().FallbackWorldObjectModel.Clone();
		object.model.Name = tostring(this.StateManager.add(object).id);
		try {
			base.initialize(object, placer);
			object.initialized = true;
		} catch (err) {
			this.log.Warn(Errors.ObjectInitializeFailed(object.id, tostring(err)));
		}
		object.model.Parent = this.root;
		object.model.PivotTo(
			CFrame.Angles(0, math.rad(position[3] * 90), 0).add(new Vector3(position[0], position[1], position[2])),
		);
		object.name = base.name;
		return object;
	}

	/**
	 * Destroys a world object with the given id.
	 * @param id The id of the world object to destroy.
	 * @param destroyer The player who placed it or string for systems.
	 */
	destroy(id: number, destroyer: string | Player): { success: boolean; code: string } {
		const object = this.get(id);
		if (object === undefined) return { success: false, code: `Inavlid ID #${id}` };
		const base = TechTree.getInstance().get(object.name) as WorldObject<WorldObjectState>;
		if (base === undefined || !types.WorldObject(base)) {
			this.log.Warn(Errors.CannotDestroyObjectNotOnTechTree(object.name), "Iron.WorldObjectManager.create()");
			return { success: false, code: `Invalid Object Type ${object.name}` };
		}
		this.StateManager.remove(id);
		base.destroy(object, destroyer);
		object.model?.Destroy();
		return { success: true, code: `Removed ${base.display}` };
	}
}
