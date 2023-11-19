import { EnumTree } from "../../../Enum";
import { ModelAsset } from "./model";

export class WorldObjectModelAsset extends ModelAsset {
	collider: Part | undefined;
	baseModel: Model | undefined;
	constructor(name: string, assetType: EnumTree.AssetType, model: Model) {
		super(name, assetType, model);
		for (const child of model.GetChildren()) {
			switch (child.Name) {
				case "Model":
					if (!child.IsA("Model")) break;
					this.baseModel = child;
					break;
				case "Collider":
					if (!child.IsA("Part")) break;
					child.Color = Color3.fromRGB(0, 255, 0);
					child.Material = Enum.Material.ForceField;
					child.Transparency = 1;
					this.collider = child;
					break;
				default:
					break;
			}
		}
	}
}
