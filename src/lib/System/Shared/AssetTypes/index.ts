import { EnumTree } from "../../../Enum";

export abstract class Asset {
	name: string;
	type: EnumTree.AssetType;
	constructor(name: string, assetType: EnumTree.AssetType) {
		this.name = name;
		this.type = assetType;
	}
}
