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
	export namespace InternalLinkCommand {
		export interface OpenView extends EnumTreeItem {
			Name: "OpenView";
			Value: 0;
		}

		export const OpenView: OpenView = {
			Name: "OpenView",
			Value: 0,
		};

		export interface CloseView extends EnumTreeItem {
			Name: "CloseView";
			Value: 1;
		}

		export const CloseView: CloseView = {
			Name: "CloseView",
			Value: 1,
		};

		export interface UpdateView extends EnumTreeItem {
			Name: "UpdateView";
			Value: 2;
		}

		export const UpdateView: UpdateView = {
			Name: "UpdateView",
			Value: 2,
		};

		export interface LoadView extends EnumTreeItem {
			Name: "LoadView";
			Value: 3;
		}

		export const LoadView: LoadView = {
			Name: "LoadView",
			Value: 3,
		};

		export interface GetObjectById extends EnumTreeItem {
			Name: "GetObjectById";
			Value: 4;
		}

		export const GetObjectById: GetObjectById = {
			Name: "GetObjectById",
			Value: 4,
		};
	}

	export type InternalLinkCommand =
		| InternalLinkCommand.OpenView
		| InternalLinkCommand.CloseView
		| InternalLinkCommand.UpdateView
		| InternalLinkCommand.LoadView
		| InternalLinkCommand.GetObjectById;

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
}

interface EnumTreeItem {
	Name: string;
	Value: number;
}
