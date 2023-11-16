function assemble(message: string, messageType: string, tree: string | undefined) {
	if (tree === undefined)
		return `[Iron - ${messageType}][${DateTime.now().FormatUniversalTime("hh:mm:ss", "en-us")}]: ${message}`;
	return `[Iron - ${messageType}][Tree: ${tree}][${DateTime.now().FormatUniversalTime(
		"hh:mm:ss",
		"en-us",
	)}]: ${message}`;
}

namespace console {
	export function error(
		message: string,
		tree: string | undefined = undefined,
		typeOverride: string | undefined = undefined,
	) {
		error(assemble(message, typeOverride === undefined ? "Error" : typeOverride, tree));
	}
	export function warn(
		message: string,
		tree: string | undefined = undefined,
		typeOverride: string | undefined = undefined,
	) {
		warn(assemble(message, typeOverride === undefined ? "Warn" : typeOverride, tree));
	}
	export function log(
		message: string,
		tree: string | undefined = undefined,
		typeOverride: string | undefined = undefined,
	) {
		print(assemble(message, typeOverride === undefined ? "Info" : typeOverride, tree));
	}
	export function debug(): DebugPacket {
		return new DebugPacket();
	}
}

export default console;

export class DebugPacket {
	logs: {
		type: number;
		message: string;
		tree: string | undefined;
		typeOverride: string | undefined;
	}[] = [];
	error(message: string, tree: string | undefined = undefined, typeOverride: string | undefined = undefined) {
		this.print();
		console.error(message, tree, typeOverride);
	}
	warn(message: string, tree: string | undefined = undefined, typeOverride: string | undefined = undefined) {
		this.logs.push({ type: 1, message: message, tree: tree, typeOverride: typeOverride });
	}
	log(message: string, tree: string | undefined = undefined, typeOverride: string | undefined = undefined) {
		this.logs.push({ type: 0, message: message, tree: tree, typeOverride: typeOverride });
	}
	print() {
		for (const log of this.logs) {
			switch (log.type) {
				case 0:
					console.log(log.message, log.tree, log.typeOverride);
					break;
				case 1:
					console.warn(log.message, log.tree, log.typeOverride);
					break;
				default:
					console.error("Could not print log", "DebugPacket.print()");
					break;
			}
		}
	}
}
