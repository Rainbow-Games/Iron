import { t } from "@rbxts/t";

export const RemoteFunctionLink: RemoteFunction = new Instance("RemoteFunction");
export const RemoteEventLink: RemoteEvent = new Instance("RemoteEvent");

const packet = t.interface({
	name: t.string,
	data: t.any,
});

/**Function Link for the server to run functions on clients and have the client run functions on the server. */
export class ServerFunctionLink {
	/**All connected callbacks for client -> server -> client functions.  */
	private readonly connections = new Map<string, (player: Player, data: unknown) => unknown>();
	/**fires a server -> client -> server function */
	fire<T>(player: Player, check: t.check<T>, name: string, data: unknown): T | unknown {
		const res = RemoteFunctionLink.InvokeClient(player, { name, data });
		if (check(res)) {
			return res;
		}
	}
	/**handles all functions recived from the clients */
	private handle(player: Player, args: unknown) {
		if (!packet(args)) return;
		const callback = this.connections.get(args.name);
		if (!callback) return;
		return callback(player, args.data);
	}
	/**Connects the handle. */
	constructor() {
		RemoteFunctionLink.OnServerInvoke = this.handle;
	}
	/**Sets a new callback to a function name */
	connect(name: string, callback: (data: unknown) => unknown): void {
		this.connections.set(name, callback);
	}
	/**removes a callback from a function name */
	disconnect(name: string): void {
		this.connections.delete(name);
	}
}

/** allows the server to run functions on the client or the client to run functions on the server. */
export class ClientFunctionLink {
	/**All connected callbacks to server -> client -> server functions */
	private readonly connections = new Map<string, (data: unknown) => unknown>();
	fire<T>(check: t.check<T>, name: string, data: unknown): T | unknown {
		const res = RemoteFunctionLink.InvokeServer({ name, data });
		if (check(res)) {
			return res;
		}
	}
	/**handles all incoming server functions. */
	private handle(args: unknown) {
		if (!packet(args)) return;
		const callback = this.connections.get(args.name);
		if (!callback) return;
		return callback(args.data);
	}
	/**connects the handle */
	constructor() {
		RemoteFunctionLink.OnClientInvoke = this.handle;
	}
	/**connects a function to a name that the server can run. */
	connect(name: string, callback: (data: unknown) => unknown): void {
		this.connections.set(name, callback);
	}
	/**diconnects connected functions by there name */
	disconnect(name: string): void {
		this.connections.delete(name);
	}
}

/**allows the server to fire events on the client. */
export class ServerEventLink {
	/**all the connections for event names */
	private readonly connections = new Map<string, (player: Player, data: unknown) => void>();
	/** fires an event on a cleint */
	fire(player: Player, name: string, data: unknown) {
		RemoteEventLink.FireClient(player, { name, data });
	}
	/** handles all incoming client to server events */
	private handle(player: Player, args: unknown) {
		if (!packet(args)) return;
		const callback = this.connections.get(args.name);
		if (!callback) return;
		callback(player, args.data);
	}
	/** connects the handle */
	constructor() {
		RemoteEventLink.OnServerEvent.Connect((player, args) => this.handle(player, args));
	}
	/**connects a callback to an event with the given name  */
	connect(name: string, callback: (player: Player, data: unknown) => void): void {
		this.connections.set(name, callback);
	}
	/**disconnects a callback with a given name */
	disconnect(name: string): void {
		this.connections.delete(name);
	}
}

export class ClientEventLink {
	private readonly connections = new Map<string, (data: unknown) => void>();
	fire(name: string, data: unknown) {
		RemoteEventLink.FireServer({ name, data });
	}
	private handle(args: unknown) {
		if (!packet(args)) return;
		const callback = this.connections.get(args.name);
		if (!callback) return;
		callback(args.data);
	}
	constructor() {
		RemoteEventLink.OnClientEvent.Connect((args) => this.handle(args));
	}
	connect(name: string, callback: (data: unknown) => void): void {
		this.connections.set(name, callback);
	}
	disconnect(name: string): void {
		this.connections.delete(name);
	}
}
