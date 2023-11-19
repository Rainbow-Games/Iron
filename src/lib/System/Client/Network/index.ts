import { ReplicatedStorage } from "@rbxts/services";
import { EnumTree } from "../../../Enum";
import { EventManager } from "../../Shared/EventManager";
import { IEvent } from "../../Shared/EventManager/types";
import { t } from "@rbxts/t";

export class Link {
	private readonly revent = ReplicatedStorage.WaitForChild("@rbxts/iron").WaitForChild("event") as RemoteEvent;
	private readonly rfunc = ReplicatedStorage.WaitForChild("@rbxts/iron").WaitForChild("function") as RemoteFunction;

	/**unique id of link */
	readonly identifier: string;

	readonly event: IEvent = EventManager.getInstance().Add();

	/**
	 * Fires the other side.
	 */
	Fire(packet: unknown) {
		this.revent.FireServer(this.identifier, packet);
	}

	/**
	 * Invokes the other side and returns output.
	 */
	Invoke(packet: unknown): unknown {
		return this.rfunc.InvokeServer(this.identifier, packet);
	}

	/**
	 * Fires a callback every time the other side invokes.
	 * @param callback The callback to fire.
	 * @returns The connection's data.
	 */
	setCallback(callback: (packet: unknown) => unknown): void {
		this.rfunc.OnClientInvoke = callback;
	}

	constructor(identifier: string | EnumTree.InternalNetworkCommand) {
		this.identifier = t.string(identifier) ? identifier : identifier.Name;
		this.revent.OnClientEvent.Connect((identifier: unknown, packet: unknown) => {
			if (identifier !== this.identifier) return;
			this.event.Fire(packet);
		});
	}
}
