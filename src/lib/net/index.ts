import { t } from "@rbxts/t";
import { RunService } from "@rbxts/services";
import { NetLinkInterface } from "./types";

if (RunService.IsServer()) {
	const remoteEvent = new Instance("RemoteEvent");
	const remoteFunction = new Instance("RemoteFunction");
	remoteEvent.Parent = script;
	remoteFunction.Parent = script;
}

const remote = {
	event: script.WaitForChild("RemoteEvent") as RemoteEvent,
	function: script.WaitForChild("RemoteFunction") as RemoteFunction,
};

const Packet = t.interface({
	cmd: t.number,
	props: t.array(t.any),
});

/**Creates links between the client and server. */
export class NetLink implements NetLinkInterface {
	/**Used to give all connections a unique id */
	private id = 0;
	/**All of the connections for events */
	private connections = new Map<number, { cmd: number; callback: (...args: unknown[]) => void; once: boolean }>();
	/**All of the connections for functions */
	private callbacks = new Map<number, (...args: unknown[]) => unknown>();
	/**
	 * Fires an event on the other side with the given command.
	 * @param data Player is only needed for firing clients. command is allways needed.
	 * @param args Any arguments passed into the event.
	 */
	fire(data: { player: Player | undefined; cmd: number }, ...args: unknown[]): void {
		const packet = { cmd: data.cmd, props: args };
		if (RunService.IsClient()) {
			remote.event.FireServer(packet);
		} else {
			if (!data.player) return;
			remote.event.FireClient(data.player, packet);
		}
	}
	/**
	 * Runs a function on the other side with the given command.
	 * @param data Player is only needed for firing clients. command is allways needed.
	 * @param args Any arguments passed into the function.
	 */
	invoke(data: { player: Player | undefined; cmd: number }, ...args: unknown[]): unknown {
		const packet = { cmd: data.cmd, props: args };
		if (RunService.IsClient()) {
			return remote.function.InvokeServer(packet);
		} else {
			if (!data.player) return;
			return remote.function.InvokeClient(data.player, packet);
		}
	}
	/**
	 * Connects a event to a command.
	 * @param cmd The command to connect to.
	 * @param callback The function to run when fired.
	 * @returns The connection id for disconnecting.
	 */
	connect(cmd: number, callback: (...args: unknown[]) => void): number {
		this.id += 1;
		this.connections.set(this.id, { cmd: cmd, callback: callback, once: false });
		return this.id;
	}
	/**
	 * Disconnects a connection.
	 * @param id The id of the connection to disconnect from.
	 */
	disconnect(id: number): void {
		this.connections.delete(id);
	}
	/**
	 * Connects to a command to run on fired first then auto disconnect.
	 * @param cmd The command to connect to.
	 * @param callback The function to run when fired.
	 */
	once(cmd: number, callback: (...args: unknown[]) => void): void {
		this.id += 1;
		this.connections.set(this.id, { cmd: cmd, callback: callback, once: true });
	}
	/**
	 * Sets a command to use a given callback. only one callback per command.
	 * @param cmd The command to set.
	 * @param callback The callback to set the command to
	 */
	setCallback(cmd: number, callback: (...args: unknown[]) => unknown): void {
		if (this.callbacks.get(cmd)) return;
		this.callbacks.set(cmd, callback);
	}
	/**
	 * runs all connections of the given command.
	 * @param packet The packet of data for the event
	 * @param player The player for server side.
	 */
	private onEvent(packet: unknown, player: Player | undefined = undefined) {
		if (!Packet(packet)) return;
		for (const [id, data] of this.connections) {
			if (data.cmd !== packet.cmd) continue;
			if (player) {
				data.callback(player, ...packet.props);
			} else {
				data.callback(...packet.props);
			}
			if (!data.once) continue;
			this.connections.delete(id);
		}
	}
	/**
	 * runs the set callback for the command.
	 * @param packet The packet of data for the event
	 * @param player The player for server side.
	 * @returns Callback output
	 */
	private onFunction(packet: unknown, player: Player | undefined = undefined) {
		if (player) {
			if (!Packet(packet)) return;
			const callback = this.callbacks.get(packet.cmd);
			if (!callback) return;
			return callback(player, ...packet.props);
		}
		if (!Packet(packet)) return;
		const callback = this.callbacks.get(packet.cmd);
		if (!callback) return;
		return callback(...packet.props);
	}
	constructor() {
		if (RunService.IsClient()) {
			remote.event.OnClientEvent.Connect((packet) => this.onEvent(packet));
			remote.function.OnClientInvoke = (packet) => this.onFunction(packet);
		} else {
			remote.event.OnServerEvent.Connect((player, packet) => this.onEvent(packet, player));
			remote.function.OnServerInvoke = (player, packet) => this.onFunction(packet, player);
		}
	}
}
