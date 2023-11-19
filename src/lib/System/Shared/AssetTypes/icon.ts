import { Asset } from ".";
import { EnumTree } from "../../../Enum";

export class IconAsset extends Asset {
	source: string;
	size: { x: number; y: number };
	constructor(name: string, assetType: EnumTree.AssetType, assetID: string, size: { x: number; y: number }) {
		super(name, assetType);
		this.source = assetID;
		this.size = size;
	}
}
