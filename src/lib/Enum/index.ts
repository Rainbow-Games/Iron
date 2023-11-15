interface EnumTree {
	GetEnumItems(this: Enum): Array<EnumItem>;
}

export declare namespace EnumTree {
	export function GetEnums(this: Enums): Array<Enum>;

	/**
	 * The type of instance the game is running on.
	 */
	export namespace RunType {
		export interface Server extends EnumItem {
			Name: "Server";
			Value: 0;
			EnumType: typeof EnumTree.RunType;
		}

		export const Server: Server;

		export interface Client extends EnumItem {
			Name: "Deny";
			Value: 1;
			EnumType: typeof EnumTree.RunType;
		}

		export const Client: Client;

		export interface Studio extends EnumItem {
			Name: "Studio";
			Value: 2;
			EnumType: typeof EnumTree.RunType;
		}

		export const Studio: Studio;

		export function GetEnumItems(this: EnumTree): Array<EnumTree.RunType>;
	}
	export type RunType = RunType.Client | RunType.Server | RunType.Studio;

	/**
	 * Internal networking commands for fireing / reciving events and functions
	 */
	export namespace InternalLinkCommand {
		export interface OpenView extends EnumItem {
			Name: "OpenView";
			Value: 0;
			EnumType: typeof EnumTree.InternalLinkCommand;
		}

		export const OpenView: OpenView;

		export interface CloseView extends EnumItem {
			Name: "CloseView";
			Value: 1;
			EnumType: typeof EnumTree.InternalLinkCommand;
		}

		export const CloseView: CloseView;

		export interface UpdateView extends EnumItem {
			Name: "UpdateView";
			Value: 2;
			EnumType: typeof EnumTree.InternalLinkCommand;
		}

		export const UpdateView: UpdateView;

		export interface LoadView extends EnumItem {
			Name: "LoadView";
			Value: 3;
			EnumType: typeof EnumTree.InternalLinkCommand;
		}

		export const LoadView: LoadView;

		export interface GetObjectById extends EnumItem {
			Name: "GetObjectById";
			Value: 4;
			EnumType: typeof EnumTree.InternalLinkCommand;
		}

		export const GetObjectById: GetObjectById;

		export function GetEnumItems(this: EnumTree): Array<EnumTree.InternalLinkCommand>;
	}

	export type InternalLinkCommand =
		| InternalLinkCommand.OpenView
		| InternalLinkCommand.CloseView
		| InternalLinkCommand.UpdateView
		| InternalLinkCommand.LoadView
		| InternalLinkCommand.GetObjectById;
}
