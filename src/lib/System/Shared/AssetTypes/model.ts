import { Asset } from ".";
import { EnumTree } from "../../../Enum";

export class ModelAsset extends Asset {
	source: Model;

	constructor(name: string, assetType: EnumTree.AssetType, model: Model) {
		super(name, assetType);
		this.source = model;
	}
}
