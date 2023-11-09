import { ItemBase } from "./item/types";
import { Item, TechTreeTypes, WorldObject, WorldObjectComponent, WorldObjectItem } from "./t";
import { TechTreeInterface } from "./types";
import { WorldObjectBase, WorldObjectComponentBase } from "./world-object/types";

class TechTreeClass implements TechTreeInterface {
	private WorldObjects = new Map<string, WorldObjectBase>();
	private WorldObjectComponents = new Map<string, WorldObjectComponentBase>();
	private Items = new Map<string, ItemBase>();
	add(techType: number, object: unknown): boolean {
		switch (techType) {
			case TechTreeTypes.WorldObject:
				if (!WorldObject(object)) return false;
				this.WorldObjects.set(object.name, object);
				return true;
			case TechTreeTypes.WorldObjectComponent:
				if (!WorldObjectComponent(object)) return false;
				this.WorldObjectComponents.set(object.name, object);
				return true;
			case TechTreeTypes.Item:
				if (!Item(object) && !WorldObjectItem(object)) return false;
				this.Items.set(object.name, object);
				return true;
			default:
				return false;
		}
	}
	get(techType: number, name: string): unknown {
		switch (techType) {
			case TechTreeTypes.WorldObject:
				return this.WorldObjects.get(name);
			case TechTreeTypes.WorldObjectComponent:
				return this.WorldObjectComponents.get(name);
			case TechTreeTypes.Item:
				return this.Items.get(name);
			default:
				return false;
		}
	}
}
export const TechTree = new TechTreeClass();
