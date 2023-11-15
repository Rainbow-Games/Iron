// **OLD SYSTEM: PENDING REWORK**

import { ItemBase } from "./item/types";
import { Item, TechTreeTypes, View, WorldObject, WorldObjectComponent, WorldObjectItem } from "./t";
import { TechTreeInterface } from "./types";
import { ViewInterface } from "./view/types";
import { WorldObjectBase, WorldObjectComponentBase } from "./world-object/types";

export class TechTree implements TechTreeInterface {
	private constructor() {}
	private static instance: TechTree;
	static getInstance(): TechTree {
		if (!this.instance) this.instance = new TechTree();
		return this.instance;
	}
	private WorldObjects = new Map<string, WorldObjectBase>();
	private WorldObjectComponents = new Map<string, WorldObjectComponentBase>();
	private Views = new Map<string, ViewInterface>();
	private Items = new Map<string, ItemBase>();
	Types = TechTreeTypes;
	add(techType: number, object: unknown): boolean {
		switch (techType) {
			case TechTreeTypes.WorldObject:
				if (!WorldObject(object)) return false;
				this.WorldObjects.set(object.name, object as WorldObjectBase);
				return true;
			case TechTreeTypes.WorldObjectComponent:
				if (!WorldObjectComponent(object)) return false;
				this.WorldObjectComponents.set(object.name, object as WorldObjectComponentBase);
				return true;
			case TechTreeTypes.Item:
				if (!Item(object) && !WorldObjectItem(object)) return false;
				this.Items.set(object.name, object);
				return true;
			case TechTreeTypes.View:
				if (!View(object)) return false;
				this.Views.set(object.name, object);
				return true;
			default:
				return false;
		}
	}
	getAll(techType: number) {
		const contents: defined[] = [];
		switch (techType) {
			case TechTreeTypes.WorldObject:
				this.WorldObjects.forEach((o) => contents.push(o));
				break;
			case TechTreeTypes.WorldObjectComponent:
				this.WorldObjectComponents.forEach((o) => contents.push(o));
				break;
			case TechTreeTypes.Item:
				this.Items.forEach((o) => contents.push(o));
				break;
			case TechTreeTypes.View:
				this.Views.forEach((o) => contents.push(o));
				break;
			default:
				break;
		}
		return contents;
	}
	get(techType: number, name: string): unknown {
		switch (techType) {
			case TechTreeTypes.WorldObject:
				return this.WorldObjects.get(name);
			case TechTreeTypes.WorldObjectComponent:
				return this.WorldObjectComponents.get(name);
			case TechTreeTypes.Item:
				return this.Items.get(name);
			case TechTreeTypes.View:
				return this.Views.get(name);
			default:
				return false;
		}
	}
}
