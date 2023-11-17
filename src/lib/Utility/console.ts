function assemble(message: string, messageType: string, tree: string | undefined, prefix: string | undefined) {
	if (tree === undefined) return `${prefix !== undefined ? prefix : ""}[Iron - ${messageType}]: ${message}`;
	return `${prefix !== undefined ? prefix : ""}[Iron - ${messageType}][Tree: ${tree}]: ${message}`;
}

const debugPackets: DebugPacket[] = [];

export namespace Console {
	export function Error(
		message: string,
		tree: string | undefined = undefined,
		typeOverride: string | undefined = undefined,
		prefix: string | undefined = undefined,
	) {
		error(assemble(message, typeOverride === undefined ? "Error" : typeOverride, tree, prefix));
	}
	export function Warn(
		message: string,
		tree: string | undefined = undefined,
		typeOverride: string | undefined = undefined,
		prefix: string | undefined = undefined,
	) {
		warn(assemble(message, typeOverride === undefined ? "Warn" : typeOverride, tree, prefix));
	}
	export function Log(
		message: string,
		tree: string | undefined = undefined,
		typeOverride: string | undefined = undefined,
		prefix: string | undefined = undefined,
	) {
		print(assemble(message, typeOverride === undefined ? "Info" : typeOverride, tree, prefix));
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
	name: string;
	logs: {
		type: number;
		message: string;
		tree: string | undefined;
		typeOverride: string | undefined;
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
		this.logs.push({ type: 1, message: message, tree: tree, typeOverride: typeOverride });
		return this;
	}
	Log(
		message: string,
		tree: string | undefined = undefined,
		typeOverride: string | undefined = undefined,
	): DebugPacket {
		this.logs.push({ type: 0, message: message, tree: tree, typeOverride: typeOverride });
		return this;
	}
	Print(): DebugPacket {
		warn(`START Packet data for ${this.name} {`);
		for (const log of this.logs) {
			switch (log.type) {
				case 0:
					Console.Log(`${log.message}`, log.tree, log.typeOverride, "   ");
					break;
				case 1:
					Console.Warn(log.message, log.tree, log.typeOverride, "   ");
					break;
				default:
					Console.Error("Could not print log", "DebugPacket.print()");
					break;
			}
		}
		warn(`} END Packet data for ${this.name}.`);
		return this;
	}
	close() {
		debugPackets.remove(debugPackets.indexOf(this));
		this.logs = [];
	}
	constructor(name: string) {
		this.name = name;
	}
}
