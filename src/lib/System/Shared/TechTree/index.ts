import types from "../../../Type/techTree";
import { EnumTree } from "../../../Enum";
import { ITechTree } from "./types";
import { Console } from "../../../Utility/console";

namespace Errors {
	export function SpotTaken(objectName: string) {
		Console.Warn(`Name "${objectName}" is allready set.`, `Iron.TechTree.add()`);
	}
	export function WrongType(object: unknown, techTreeType: EnumTree.TechTreeType) {
		Console.Warn(`Inavlid type of ${techTreeType.Name} => ${object}`, `Iron.TechTree.add()`);
	}
	export function InvalidType(techTreeType: EnumTree.TechTreeType) {
		Console.Warn(`Inavlid TechTree type: ${techTreeType.Name}`, `Iron.TechTree.add()`);
	}
}

export class TechTree implements ITechTree {
	private constructor() {}
	private static instance: TechTree;
	static getInstance(): TechTree {
		if (this.instance === undefined) this.instance = new TechTree();
		return this.instance;
	}

	private Data = new Map<string, unknown>();

	add(techTreeType: EnumTree.TechTreeType, object: unknown) {
		switch (techTreeType) {
			case EnumTree.TechTreeType.WorldObject:
				if (!types.WorldObjectTypes(object)) {
					Errors.WrongType(object, techTreeType);
					break;
				}
				if (this.Data.get(object.name) !== undefined) {
					Errors.SpotTaken(object.name);
					break;
				}
				this.Data.set(object.name, object);
				break;
			case EnumTree.TechTreeType.WorldObjectComponent:
				if (!types.WorldObjectComponentTypes(object)) {
					Errors.WrongType(object, techTreeType);
					break;
				}
				if (this.Data.get(object.name) !== undefined) {
					Errors.SpotTaken(object.name);
					break;
				}
				this.Data.set(object.name, object);
				break;
			default:
				Errors.InvalidType(techTreeType);
				break;
		}
	}
	get(name: string) {
		return this.Data.get(name);
	}
}
