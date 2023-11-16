import types from "../../Type/techTree";
import console from "../../Utility/console";
import { EnumTree } from "../../enum";
import { DefaultWorldObjectComponentState } from "../WorldObjectManager/ComponentTypes/DefaultState";
import { WorldObjectComponent } from "../WorldObjectManager/ComponentTypes/WorldObjectComponent";
import { DefaultWorldObjectState } from "../WorldObjectManager/WorldObjectTypes/DefaultState";
import { WorldObject } from "../WorldObjectManager/WorldObjectTypes/WorldObject";
import { ITechTree } from "./types";

export class TechTree implements ITechTree {
	private constructor() {}
	private static instance: TechTree;
	static getInstance(): TechTree {
		if (this.instance === undefined) this.instance = new TechTree();
		return this.instance;
	}

	private worldObjects = new Map<string, WorldObject<DefaultWorldObjectState>>();
	private worldObjectComponents = new Map<string, WorldObjectComponent<DefaultWorldObjectComponentState>>();

	add(techTreeType: EnumTree.TechTreeType, object: unknown) {
		switch (techTreeType) {
			case EnumTree.TechTreeType.WorldObject:
				if (!types.WorldObjectTypes(object)) break;
				break;
			case EnumTree.TechTreeType.WorldObjectComponent:
				if (!types.WorldObjectComponentTypes(object)) break;
				break;
			default:
				console.warn(`Inavlid TechTree type: ${techTreeType.Name}`, `Iron.TechTree.add()`);
				break;
		}
	}
}
