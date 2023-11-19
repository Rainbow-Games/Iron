import { t } from "@rbxts/t";

export namespace EnumTree {
	/**
	 * The type of instance the game is running on.
	 */
	export namespace RunType {
		export interface Server extends EnumTreeItem {
			Name: "Server";
			Value: 0;
		}

		export const Server: Server = {
			Name: "Server",
			Value: 0,
		};

		export interface Client extends EnumTreeItem {
			Name: "Client";
			Value: 1;
		}

		export const Client: Client = {
			Name: "Client",
			Value: 1,
		};

		export interface Studio extends EnumTreeItem {
			Name: "Studio";
			Value: 2;
		}

		export const Studio: Studio = {
			Name: "Studio",
			Value: 2,
		};
	}
	export type RunType = RunType.Client | RunType.Server | RunType.Studio;

	/**
	 * Internal networking commands for fireing / reciving events and functions
	 */
	export namespace InternalNetworkCommand {
		export interface GetWorldObjectView extends EnumTreeItem {
			Name: "WorldObjectView";
			Value: 0;
		}

		export const GetWorldObjectView: GetWorldObjectView = {
			Name: "WorldObjectView",
			Value: 0,
		};

		export interface GetWorldObjectComponentView extends EnumTreeItem {
			Name: "WorldObjectComponentView";
			Value: 1;
		}

		export const GetWorldObjectComponentView: GetWorldObjectComponentView = {
			Name: "WorldObjectComponentView",
			Value: 1,
		};

		export interface GetWorldObjectToolTipView extends EnumTreeItem {
			Name: "GetWorldObjectToolTipView";
			Value: 2;
		}

		export const GetWorldObjectToolTipView: GetWorldObjectToolTipView = {
			Name: "GetWorldObjectToolTipView",
			Value: 2,
		};

		export interface Load extends EnumTreeItem {
			Name: "Load";
			Value: 3;
		}

		export const Load: Load = {
			Name: "Load",
			Value: 3,
		};
	}

	export type InternalNetworkCommand =
		| InternalNetworkCommand.GetWorldObjectView
		| InternalNetworkCommand.GetWorldObjectComponentView
		| InternalNetworkCommand.GetWorldObjectToolTipView
		| InternalNetworkCommand.Load;

	/**
	 * Internal State identifiers for use in internal systems.
	 */
	export namespace StateIdentifier {
		export interface WorldObject extends EnumTreeItem {
			Name: "WorldObject";
			Value: 0;
		}

		export const WorldObject: WorldObject = {
			Name: "WorldObject",
			Value: 0,
		};

		export interface Tickable extends EnumTreeItem {
			Name: "Tickable";
			Value: 1;
		}

		export const Tickable: Tickable = {
			Name: "Tickable",
			Value: 1,
		};

		export interface ExternalId extends EnumTreeItem {
			Name: "ExternalId";
			Value: 2;
		}

		export const ExternalId: ExternalId = {
			Name: "ExternalId",
			Value: 2,
		};

		export interface WorldObjectComponent extends EnumTreeItem {
			Name: "WorldObjectComponent";
			Value: 3;
		}

		export const WorldObjectComponent: WorldObjectComponent = {
			Name: "WorldObjectComponent",
			Value: 3,
		};
	}

	export type StateIdentifier =
		| StateIdentifier.WorldObject
		| StateIdentifier.Tickable
		| StateIdentifier.ExternalId
		| StateIdentifier.WorldObjectComponent;

	/**
	 * different types from the tech tree
	 */
	export namespace TechTreeType {
		export interface WorldObject extends EnumTreeItem {
			Name: "WorldObject";
			Value: 0;
		}

		export const WorldObject: WorldObject = {
			Name: "WorldObject",
			Value: 0,
		};

		export interface WorldObjectComponent extends EnumTreeItem {
			Name: "WorldObjectComponent";
			Value: 1;
		}

		export const WorldObjectComponent: WorldObjectComponent = {
			Name: "WorldObjectComponent",
			Value: 1,
		};
	}

	export type TechTreeType = TechTreeType.WorldObject | TechTreeType.WorldObjectComponent;

	/**
	 * different InputAction types
	 */
	export namespace InputActionType {
		export interface MouseButton1Down extends EnumTreeItem {
			Name: "MouseButton1Down";
			Value: 0;
		}

		export const MouseButton1Down: MouseButton1Down = {
			Name: "MouseButton1Down",
			Value: 0,
		};

		export interface MouseButton2Down extends EnumTreeItem {
			Name: "MouseButton2Down";
			Value: 1;
		}

		export const MouseButton2Down: MouseButton2Down = {
			Name: "MouseButton2Down",
			Value: 1,
		};

		export interface MouseMove extends EnumTreeItem {
			Name: "MouseMove";
			Value: 2;
		}

		export const MouseMove: MouseMove = {
			Name: "MouseMove",
			Value: 2,
		};
	}

	export type InputActionType =
		| InputActionType.MouseButton1Down
		| InputActionType.MouseButton2Down
		| InputActionType.MouseMove;

	/**
	 * different Asset types
	 */
	export namespace AssetType {
		export interface Icon extends EnumTreeItem {
			Name: "Icon";
			Value: 0;
		}

		export const Icon: Icon = {
			Name: "Icon",
			Value: 0,
		};

		export interface Model extends EnumTreeItem {
			Name: "Model";
			Value: 1;
		}

		export const Model: Model = {
			Name: "Model",
			Value: 1,
		};

		export interface WorldObjectModel extends EnumTreeItem {
			Name: "WorldObjectModel";
			Value: 2;
		}

		export const WorldObjectModel: WorldObjectModel = {
			Name: "WorldObjectModel",
			Value: 2,
		};
	}

	export type AssetType = AssetType.Icon | AssetType.Model | AssetType.WorldObjectModel;
}

export const EnumItemCheck = t.interface({
	Name: t.string,
	Value: t.number,
});

interface EnumTreeItem {
	Name: string;
	Value: number;
}
