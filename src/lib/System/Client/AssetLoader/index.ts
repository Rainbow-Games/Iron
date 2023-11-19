import { t } from "@rbxts/t";
import { EnumTree } from "../../../Enum";
import { Asset } from "../../Shared/AssetTypes";
import { Link } from "../Network";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { WorldObjectModelAsset } from "../../Shared/AssetTypes/worldObjectModel";
import { ModelAsset } from "../../Shared/AssetTypes/model";
import { IconAsset } from "../../Shared/AssetTypes/icon";

/**
 * The primary class for requesting assets.
 */
export class AssetLoader {
	/**
	 * The singleton for this class.
	 */
	private static instance: AssetLoader;
	private constructor() {
		this.AssetTree.push({
			type: EnumTree.AssetType.Icon,
			assets: [],
		});
		this.AssetTree.push({
			type: EnumTree.AssetType.Model,
			assets: [],
		});
		this.AssetTree.push({
			type: EnumTree.AssetType.WorldObjectModel,
			assets: [],
		});
	}
	public static getInstance(): AssetLoader {
		if (this.instance === undefined) this.instance = new AssetLoader();
		return this.instance;
	}

	private link = new Link(EnumTree.InternalNetworkCommand.Load);
	private replicated = ReplicatedStorage.WaitForChild("@rbxts/iron").WaitForChild("AssetReplicator") as Folder;

	private AssetTree: {
		type: EnumTree.AssetType;
		assets: {
			name: string;
			asset: Asset;
		}[];
	}[] = [];

	getAsset(assetType: EnumTree.AssetType, assetName: string): Asset | undefined {
		const tree = this.AssetTree.find((tree) => tree.type === assetType);
		if (!tree) return;
		const existingAsset = tree.assets.find((treeAsset) => treeAsset.name === assetName);
		if (existingAsset !== undefined) return existingAsset.asset as Asset | undefined;
		let model: Model | undefined;
		let asset: Asset | undefined;
		let iconAsset: { id: string; size: { x: number; y: number } } | undefined;
		switch (assetType) {
			case EnumTree.AssetType.Model:
				model = this.replicated.FindFirstChild(
					`${Players.LocalPlayer.UserId}:${assetName}:${assetType}`,
				) as Model;
				if (model !== undefined) {
					return new ModelAsset(assetName, EnumTree.AssetType.Model, model);
				}
				asset = this.link.Invoke({ type: assetType.Name, name: assetName }) as ModelAsset | undefined;
				if (asset === undefined) return;
				asset = new ModelAsset(
					assetName,
					assetType,
					this.replicated.FindFirstChild(
						`${Players.LocalPlayer.UserId}:${assetName}:${assetType.Name}`,
					) as Model,
				);
				break;
			case EnumTree.AssetType.WorldObjectModel:
				model = this.replicated.FindFirstChild(
					`${Players.LocalPlayer.UserId}:${assetName}:${assetType}`,
				) as Model;
				if (model !== undefined) {
					return new ModelAsset(assetName, EnumTree.AssetType.Model, model);
				}
				asset = this.link.Invoke({ type: assetType.Name, name: assetName }) as
					| WorldObjectModelAsset
					| undefined;
				if (asset === undefined) return;
				asset = new WorldObjectModelAsset(
					assetName,
					assetType,
					this.replicated.FindFirstChild(
						`${Players.LocalPlayer.UserId}:${assetName}:${assetType.Name}`,
					) as Model,
				);
				break;
			case EnumTree.AssetType.Icon:
				iconAsset = this.link.Invoke({ type: assetType.Name, name: assetName }) as
					| { id: string; size: { x: number; y: number } }
					| undefined;
				if (iconAsset === undefined) return;
				asset = new IconAsset(assetName, assetType, iconAsset.id, iconAsset.size);
				break;
			default:
				break;
		}

		if (asset === undefined) return;
		tree.assets.push({
			name: asset.name,
			asset: asset,
		});
		return asset;
	}
}
