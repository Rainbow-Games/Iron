import { RunService } from "@rbxts/services";
import { Config } from "../System/Shared/Config";
import { uptime } from "./uptime";
import { extendString } from "./extendString";

const start = os.clock();

function assemble(
	message: string,
	messageType: string,
	tree: string | undefined,
	prefix: string | undefined,
	timestamp: string | undefined,
) {
	if (tree === undefined)
		return `${timestamp !== undefined ? timestamp : uptime(start)}  ${extendString(
			`${prefix !== undefined ? prefix : ""}[Iron - ${messageType}]:`,
			" ",
			Config.getInstance().InlineLogsIndent,
			false,
		)} ${message}`;
	return `${timestamp !== undefined ? timestamp : uptime(start)}  ${extendString(
		`${prefix !== undefined ? prefix : ""}[Iron - ${messageType}][Tree: ${tree}]:`,
		" ",
		Config.getInstance().InlineLogsIndent,
		false,
	)} ${message}`;
}

const debugPackets: DebugPacket[] = [];

export namespace Console {
	export function Error(
		message: string,
		tree: string | undefined = undefined,
		typeOverride: string | undefined = undefined,
		prefix: string | undefined = undefined,
		timestamp: string | undefined = undefined,
	) {
		error(assemble(message, typeOverride === undefined ? "Error" : typeOverride, tree, prefix, timestamp));
	}
	export function Warn(
		message: string,
		tree: string | undefined = undefined,
		typeOverride: string | undefined = undefined,
		prefix: string | undefined = undefined,
		timestamp: string | undefined = undefined,
	) {
		warn(assemble(message, typeOverride === undefined ? "Warn" : typeOverride, tree, prefix, timestamp));
	}
	export function Log(
		message: string,
		tree: string | undefined = undefined,
		typeOverride: string | undefined = undefined,
		prefix: string | undefined = undefined,
		timestamp: string | undefined = undefined,
	) {
		print(assemble(message, typeOverride === undefined ? "Info" : typeOverride, tree, prefix, timestamp));
	}
	export function Debug(name: string): DebugPacket {
		const packet = debugPackets.find((p) => p.name === name);
		if (packet) return packet;
		const newPacket = new DebugPacket(name);
		debugPackets.push(newPacket);
		return newPacket;
	}
}

export class DebugPacket {
	private size = 0;
	name: string;
	logs: {
		type: number;
		message: string;
		tree: string | undefined;
		typeOverride: string | undefined;
		timestamp: string;
	}[] = [];
	Error(message: string, tree: string | undefined = undefined, typeOverride: string | undefined = undefined) {
		this.Print();
		this.close();
		Console.Error(message, tree, typeOverride);
	}
	Warn(
		message: string,
		tree: string | undefined = undefined,
		typeOverride: string | undefined = undefined,
	): DebugPacket {
		this.size++;
		if (this.logs.size() === Config.getInstance().PacketLogsCap) this.logs.remove(0);
		this.logs.push({ type: 1, message: message, tree: tree, typeOverride: typeOverride, timestamp: uptime(start) });
		return this;
	}
	Log(
		message: string,
		tree: string | undefined = undefined,
		typeOverride: string | undefined = undefined,
	): DebugPacket {
		this.size++;
		if (this.logs.size() === Config.getInstance().PacketLogsCap) this.logs.remove(0);
		this.logs.push({ type: 0, message: message, tree: tree, typeOverride: typeOverride, timestamp: uptime(start) });
		return this;
	}
	Print(): DebugPacket {
		if (
			(!Config.getInstance().PrintLogsStudio && RunService.IsStudio()) ||
			(!Config.getInstance().PrintLogsPublished && !RunService.IsStudio())
		)
			return this;
		warn(`${uptime(start)}  START Packet data for ${this.name} {`);
		if (this.size > Config.getInstance().PacketLogsCap) {
			Console.Warn(
				`MESSAGES CAPPED FROM ${this.size} TO ${this.logs.size()}`,
				"Iron.Config.PacketLogsCap",
				"Notice",
				" * ",
			);
		}
		for (let i = 0; i < this.logs.size(); i++) {
			const log = this.logs[i];
			switch (log.type) {
				case 0:
					Console.Log(log.message, log.tree, log.typeOverride, "   ", log.timestamp);
					break;
				case 1:
					Console.Warn(log.message, log.tree, log.typeOverride, "   ", log.timestamp);
					break;
				default:
					Console.Error("Could not print log", "DebugPacket.print()");
					break;
			}
		}
		if (this.logs.size() === 0) {
			Console.Log("No logs in this packet.", `Packet - ${this.name}`, undefined, "   ");
		}
		warn(`${uptime(start)}  } END Packet data for ${this.name}.`);
		return this;
	}
	close() {
		debugPackets.remove(debugPackets.indexOf(this));
		this.logs = [];
		this.size = 0;
	}
	constructor(name: string) {
		this.name = name;
	}
}
