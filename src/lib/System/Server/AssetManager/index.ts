import { t } from "@rbxts/t";
import { EnumItemCheck, EnumTree } from "../../../Enum";
import { Link } from "../Network";
import { Asset } from "../../Shared/AssetTypes";
import { ReplicatedStorage } from "@rbxts/services";
import { ModelAsset } from "../../Shared/AssetTypes/model";
import { Console } from "../../../Utility/console";
import { WorldObjectModelAsset } from "../../Shared/AssetTypes/worldObjectModel";

/**
 * The primary class for managing assets.
 */
export class AssetManager {
	/**
	 * The singleton for this class.
	 */
	private static instance: AssetManager;
	public static getInstance(): AssetManager {
		if (this.instance === undefined) this.instance = new AssetManager();
		return this.instance;
	}

	private link = new Link(EnumTree.InternalNetworkCommand.Load);
	log = Console.Debug("Iron.AssetManager");
	private replicated = ReplicatedStorage.FindFirstChild("@rbxts/iron")?.FindFirstChild("AssetReplicator") as Folder;

	private AssetTree: {
		type: EnumTree.AssetType;
		assets: {
			name: string;
			asset: Asset;
		}[];
	}[] = [];

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

		const Packet = t.interface({
			type: t.string,
			name: t.string,
		});

		this.link.setCallback((player, packet) => {
			if (!Packet(packet)) return;
			return this.loadAsset(player, packet.type, packet.name);
		});
	}

	registerAsset(asset: Asset): Asset | undefined {
		const tree = this.AssetTree.find((tree) => tree.type === asset.type);
		if (!tree) return;
		if (tree.assets.find((treeAsset) => treeAsset.name === asset.name) !== undefined) return;
		tree.assets.push({
			name: asset.name,
			asset: asset,
		});
		return asset;
	}

	getAsset(assetType: EnumTree.AssetType | string, assetName: string): Asset | undefined {
		const tree = this.AssetTree.find(
			(tree) => tree.type.Name === (t.string(assetType) ? assetType : assetType.Name),
		);
		if (!tree) return;
		return tree.assets.find((treeAsset) => treeAsset.name === assetName)?.asset;
	}

	loadAsset(player: Player, assetType: string, assetName: string): Asset | undefined {
		const asset = this.getAsset(assetType, assetName);
		if (asset === undefined) return;
		this.log.Log(
			`Player "${player.Name}" has loaded asset "${assetName}" of type ${assetType}`,
			"Iron.AssetManager.loadAsset()",
		);
		let model: Model;
		switch (assetType) {
			case EnumTree.AssetType.Model.Name:
				if (this.replicated.FindFirstChild(`${player.UserId}:${assetName}:${assetType}`)) return;
				model = (asset as ModelAsset).source.Clone();
				model.Name = `${player.UserId}:${assetName}:${assetType}`;
				model.Parent = this.replicated;
				return new ModelAsset(assetName, EnumTree.AssetType.Model, model);
			case EnumTree.AssetType.WorldObjectModel.Name:
				if (this.replicated.FindFirstChild(`${player.UserId}:${assetName}:${assetType}`)) return;
				model = (asset as WorldObjectModelAsset).source.Clone();
				model.Name = `${player.UserId}:${assetName}:${assetType}`;
				model.Parent = this.replicated;
				return new WorldObjectModelAsset(assetName, EnumTree.AssetType.WorldObjectModel, model);
			case EnumTree.AssetType.Icon.Name:
				return asset;
			default:
				break;
		}
	}
}
