import { BroadcastAction } from "@rbxts/reflex";
import { Client, Server, createRemotes, remote } from "@rbxts/remo";

export const remotes = createRemotes({
	dispatch: remote<Client, [BroadcastAction[]]>(),
	start: remote<Server>(),
});
