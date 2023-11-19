import { ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { Console } from "../../../Utility/console";
import { extendString } from "../../../Utility/extendString";

namespace Errors {
	export function ServerShutdown(reason: string | undefined = undefined) {
		return "SERVER SHUTTING DOWN" + reason !== undefined ? ", Reason: " + reason : "!";
	}
	export function ServerRemoveFail(trys: number) {
		return `Failed to remove server from server list... try ${trys}/10`;
	}
	export function ServerAddFail() {
		return `Failed to add server to server list.`;
	}
	export function ServerInfo(serverId: number, studio: boolean = false) {
		return `Server is running ${studio ? "in studio" : "on published server"} with id #${serverId}.`;
	}
}

export class ServerManager {
	private static instance: ServerManager;

	static getInstance(): ServerManager {
		if (this.instance === undefined) this.instance = new ServerManager();
		return this.instance;
	}

	readonly serverId: number = 0;
	readonly machine: string;

	/**
	 * [iteration, time]
	 */
	private iteration = 0;
	private last = "";

	/**
	 * Makes a unique id for an object.
	 * @returns A unique id.
	 */
	snowflake(): number {
		const time = DateTime.now().FormatUniversalTime("YYYYMMDDhhmmss", "en-us");
		if (time !== this.last) {
			this.last = time;
			this.iteration = 0;
		} else {
			this.iteration += 1;
		}
		return (
			tonumber(
				`1${extendString(tostring(this.serverId), "0", 6)}${extendString(
					tostring(this.iteration),
					"0",
					3,
				)}${time}`,
			) ?? 0
		);
	}

	/**
	 * Shutsdown the server and moves all players to another server (or kicks if in studio).
	 */
	shutdown(reason: string | undefined = undefined) {
		Errors.ServerShutdown(reason);
		if (RunService.IsStudio()) {
			for (const player of game.GetService("Players").GetPlayers()) {
				player.Kick("Server Shutdown");
			}
		} else {
			const tps = game.GetService("TeleportService");
			const reserved = tps.ReserveServer(game.PlaceId);
			tps.TeleportToPrivateServer(game.PlaceId, reserved[0], game.GetService("Players").GetPlayers());
		}
	}

	/**
	 * Assigns the server id and binds closing functions.
	 */
	private constructor() {
		const log = Console.Debug("Iron Initialization");
		const wRoot = new Instance("Folder");
		wRoot.Name = "@rbxts/iron";
		wRoot.Parent = Workspace;

		const rsRoot = new Instance("Folder");
		rsRoot.Name = "@rbxts/iron";
		rsRoot.Parent = ReplicatedStorage;

		const ar = new Instance("Folder");
		ar.Name = "AssetReplicator";
		ar.Parent = rsRoot;

		const revent = new Instance("RemoteEvent");
		revent.Name = "event";
		revent.Parent = rsRoot;

		const rfunc = new Instance("RemoteFunction");
		rfunc.Name = "function";
		rfunc.Parent = rsRoot;

		if (RunService.IsStudio()) {
			this.machine = "STUDIO";
			this.serverId = 1;
			log.Log(Errors.ServerInfo(this.serverId, true), "Iron.ServerManager");
			return;
		} else {
			this.machine = game.JobId;
		}

		const serverStore: OrderedDataStore = game
			.GetService("DataStoreService")
			.GetOrderedDataStore("@rbxts/iron/INTERNAL/SERVERS");

		// gets the server store data
		const [success, pages] = pcall(function () {
			return serverStore.GetSortedAsync(true, 10);
		});
		if (!success) {
			task.spawn(() => log.Error(Errors.ServerAddFail(), "Iron.ServerManager"));
			this.shutdown();
			return this;
		}

		// Gets the lowest id to occupy
		for (;;) {
			const entries = pages.GetCurrentPage();
			for (const entry of entries) {
				if (entry.value === this.serverId) {
					this.serverId += 1;
				} else {
					break;
				}
			}
			if (pages.IsFinished) {
				break;
			} else {
				pages.AdvanceToNextPageAsync();
			}
		}

		// adds this server to the server store
		const machine = this.machine;
		const id = this.serverId;
		const [_, err] = pcall(function () {
			return serverStore.SetAsync(machine, id);
		});
		if (err !== undefined) {
			task.spawn(() => log.Error(Errors.ServerAddFail(), "Iron.ServerManager"));
			this.shutdown("Failed to add server to server list");
			return this;
		}

		// binds server removal to shutdown
		game.BindToClose(function () {
			ServerManager.getInstance().shutdown("server shutting down");
			let trys = 1;
			while (trys <= 10) {
				const [s, _] = pcall(function () {
					return serverStore.RemoveAsync(machine);
				});
				if (s) {
					break;
				}
				log.Warn(Errors.ServerRemoveFail(trys), "Iron.ServerManager");
				trys += 1;
				task.wait(0.5); // prevents datastore overload.
			}
		});

		log.Log(Errors.ServerInfo(this.serverId), "Iron.ServerManager");
	}
}
