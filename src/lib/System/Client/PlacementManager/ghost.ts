import { Workspace } from "@rbxts/services";
import { EnumTree } from "../../../Enum";
import { WorldObjectModelAsset } from "../../Shared/AssetTypes/worldObjectModel";
import { Config } from "../../Shared/Config";
import { AssetLoader } from "../AssetLoader";
import { Console } from "../../../Utility/console";

/**
 * The primary building placement script
 */
export class PlacementGhost {
	/**
	 * The singleton for this class.
	 */
	private static instance: PlacementGhost;
	private constructor() {}
	public static getInstance(): PlacementGhost {
		if (this.instance === undefined) this.instance = new PlacementGhost();
		return this.instance;
	}

	private connections: RBXScriptConnection[] = [];
	private touching: { WorldObject: Instance; parts: Part[] }[] = [];

	private worldObjects = Workspace.WaitForChild("@rbxts/iron").WaitForChild("WorldObjects") as Folder;

	model: Model | undefined = undefined;
	type: string = "";

	clear(): void {
		if (this.model) this.model.Destroy();
		this.type = "";
	}

	set(name: string) {
		if (this.model) this.model.Destroy();
		this.type = name;
		const asset = AssetLoader.getInstance().getAsset(EnumTree.AssetType.WorldObjectModel, this.type) as
			| WorldObjectModelAsset
			| undefined;
		this.model = asset !== undefined ? asset.source.Clone() : Config.getInstance().FallbackWorldObjectModel;
		const modelBase = this.model.FindFirstChild("Model");
		if (!modelBase) return;
		for (const decendent of modelBase.GetDescendants()) {
			if (!decendent.IsA("Part") && !decendent.IsA("UnionOperation")) return;
			decendent.Transparency = 0.5;
			decendent.CanCollide = false;
		}
	}

	hide() {
		for (const conn of this.connections) {
			conn.Disconnect();
		}
		if (this.model === undefined) return;
		for (const worldObject of this.worldObjects.GetChildren()) {
			const gridSpace = worldObject.FindFirstChild("GridSpace");
			if (!gridSpace?.IsA("Part")) continue;
			gridSpace.Transparency = 1;
			gridSpace.Color = Color3.fromRGB(0, 255, 0);
		}
		this.model.Parent = undefined;
	}

	private addTouched(worldObject: Part, part: Part) {
		const _worldObject = this.touching.find((o) => o.WorldObject === worldObject);
		if (!_worldObject) {
			const gridSpace = this.model?.FindFirstChild("GridSpace");
			if (gridSpace?.IsA("Part")) {
				gridSpace.Color = Color3.fromRGB(255, 0, 0);
			}
			worldObject.Color = Color3.fromRGB(255, 0, 0);
			this.touching.push({ WorldObject: worldObject, parts: [part] });
			return;
		}
		_worldObject.parts.push(part);
	}

	private removeTouched(worldObject: Part, part: Part) {
		const _worldObject = this.touching.find((o) => o.WorldObject === worldObject);
		if (_worldObject !== undefined) {
			_worldObject.parts.remove(_worldObject.parts.indexOf(part));
			if (_worldObject.parts.size() > 0) return;
			worldObject.Color = Color3.fromRGB(0, 255, 0);
			this.touching.remove(this.touching.indexOf(_worldObject));
			return;
		}
		if (this.touching.size() !== 0) return;
		const gridSpace = this.model?.FindFirstChild("GridSpace");
		if (!gridSpace?.IsA("Part")) return;
		gridSpace.Color = Color3.fromRGB(0, 255, 0);
	}

	private async showObject(worldObject: Instance) {
		try {
			const gridSpace = worldObject.WaitForChild("GridSpace");
			if (gridSpace?.IsA("Part")) {
				gridSpace.Transparency = 0;
				gridSpace.Color = Color3.fromRGB(0, 255, 0);
			}
		} catch {
			Console.Warn(`${worldObject.Name} is missing GridSpace`, "Iron.PlacemenrManager.ghost.show()", "Error");
		}
		const colliders = worldObject.FindFirstChild("Colliders");
		if (colliders?.IsA("Folder")) {
			for (const collider of colliders.GetChildren()) {
				if (!collider.IsA("Part")) continue;
				this.connections.push(
					collider.Touched.Connect((part) => {
						if (part.Parent?.Name !== "Colliders") return;
						const touched = part.Parent.Parent?.FindFirstChild("GridSpace");
						if (!touched?.IsA("Part") || !part.IsA("Part")) return;
						this.addTouched(touched, part);
					}),
				);
				this.connections.push(
					collider.TouchEnded.Connect((part) => {
						if (part.Parent?.Name !== "Colliders") return;
						const touched = part.Parent.Parent?.FindFirstChild("GridSpace");
						if (!touched?.IsA("Part") || !part.IsA("Part")) return;
						this.removeTouched(touched, part);
					}),
				);
			}
		}
	}

	show() {
		if (this.model === undefined) return;
		this.model.Parent = Workspace;
		this.showObject(this.model);
		for (const worldObject of this.worldObjects.GetChildren()) {
			this.showObject(worldObject);
		}
		this.connections.push(this.worldObjects.ChildAdded.Connect((child) => this.showObject(child)));
	}
}
