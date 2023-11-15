const serverStore: OrderedDataStore = game
	.GetService("DataStoreService")
	.GetOrderedDataStore("@rbxts/iron/INTERNAL/SERVERS");
const tps = game.GetService("TeleportService");
import { RunService, Workspace } from "@rbxts/services";
import { IServerManager } from "./types";
import { RunsOn } from "../../Utility/Decorators/runsOn";
import { EnumTree } from "../../enum";

export class ServerManager implements IServerManager {
	private static instance: IServerManager;
	@RunsOn(EnumTree.RunType.Server)
	static getInstance(): IServerManager {
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
		const time = DateTime.now().FormatUniversalTime("YYYYMMDDhmmss", "en-us");
		if (time !== this.last) {
			this.last = time;
			this.iteration = 0;
		} else {
			this.iteration += 1;
		}

		let iteration = tostring(this.iteration);
		while (iteration.size() < 3) {
			iteration = "0" + iteration;
		}

		let serverId = tostring(this.serverId);
		while (serverId.size() < 6) {
			serverId = "0" + serverId;
		}

		return tonumber(`1${serverId}${iteration}${time}`) ?? 0;
	}

	/**
	 * Shutsdown the server and moves all players to another server (or kicks if in studio).
	 */
	shutdown() {
		if (RunService.IsStudio()) {
			for (const player of game.GetService("Players").GetPlayers()) {
				player.Kick("Server Shutdown");
			}
		} else {
			const reserved = tps.ReserveServer(game.PlaceId);
			tps.TeleportToPrivateServer(game.PlaceId, reserved[0], game.GetService("Players").GetPlayers());
		}
	}

	/**
	 * Assigns the server id and binds closing functions.
	 */
	private constructor() {
		const root = new Instance("Folder");
		root.Name = "@rbxts/iron";
		root.Parent = Workspace;

		if (RunService.IsStudio()) {
			this.machine = "STUDIO";
			this.serverId = 1;
			return;
		} else {
			this.machine = game.JobId;
		}

		// gets the server store data
		const [success, pages] = pcall(function () {
			return serverStore.GetSortedAsync(true, 10);
		});
		if (!success) {
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
			this.shutdown();
			return this;
		}

		// binds server removal to shutdown
		game.BindToClose(function () {
			let trys = 0;
			while (trys < 10) {
				const [s, _] = pcall(function () {
					return serverStore.RemoveAsync(machine);
				});
				if (s) {
					break;
				}
				trys += 1;
				task.wait(0.5); // prevents datastore overload.
			}
		});
	}
}
