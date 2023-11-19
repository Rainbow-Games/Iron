import { ReplicatedStorage } from "@rbxts/services";
import { EnumTree } from "../../../Enum";
import { EventManager } from "../../Shared/EventManager";
import { IEvent } from "../../Shared/EventManager/types";
import { t } from "@rbxts/t";

export class LinkManager {
	private constructor() {
		this.rfunc.OnServerInvoke = (player: Player, identifier: unknown, packet: unknown) => {
			for (const callback of this.Callbacks) {
				if (callback.identifier !== identifier) continue;
				return callback.callback(player, packet);
			}
		};
	}
	private static instance: LinkManager;
	static getInstance(): LinkManager {
		if (this.instance === undefined) this.instance = new LinkManager();
		return this.instance;
	}
	Callbacks: { identifier: string; callback: Callback }[] = [];
	rfunc: RemoteFunction = ReplicatedStorage.WaitForChild("@rbxts/iron").WaitForChild("function") as RemoteFunction;
}

export class Link {
	/**unique id of link */
	readonly identifier: string;

	readonly event: IEvent = EventManager.getInstance().Add();

	private readonly revent = ReplicatedStorage.WaitForChild("@rbxts/iron").WaitForChild("event") as RemoteEvent;

	/**
	 * Fires the client side.
	 */
	Fire(player: Player, packet: unknown) {
		this.revent.FireClient(player, packet);
	}

	/**
	 * Invokes the client and returns output.
	 */
	Invoke(player: Player, packet: unknown): unknown {
		return LinkManager.getInstance().rfunc.InvokeClient(player, packet);
	}

	/**
	 * Fires a callback every time the client invokes.
	 * @param callback The callback to fire.
	 * @returns The connection's data.
	 */
	setCallback(callback: (player: Player, packet: unknown) => unknown): void {
		const obj = LinkManager.getInstance().Callbacks.find((o) => o.identifier === this.identifier);
		if (obj === undefined) {
			LinkManager.getInstance().Callbacks.push({ identifier: this.identifier, callback: callback });
		} else {
			obj.callback = callback;
		}
	}

	constructor(identifier: string | EnumTree.InternalNetworkCommand) {
		this.identifier = t.string(identifier) ? identifier : identifier.Name;
		this.revent.OnServerEvent.Connect((player: Player, identifier: unknown, packet: unknown) => {
			if (identifier !== this.identifier) return;
			this.event.Fire(player, packet);
		});
	}
}
