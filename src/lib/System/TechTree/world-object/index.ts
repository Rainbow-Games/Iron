// **OLD SYSTEM: PENDING REWORK**

import { Utility } from "../../utility";
import { RunService, Workspace } from "@rbxts/services";
import { TechTreeTypes, WorldObject, WorldObjectComponent } from "../t";
import { TechTree } from "..";
import {
	ClonedWorldObjectComponentInterface,
	ClonedWorldObjectInterface,
	WorldObjectBase,
	WorldObjectComponentBase,
	WorldObjectManagerInterface,
} from "./types";
import { Bin } from "../../bin";
import { t } from "@rbxts/t";
import { Link } from "../../net/old-index";

/**A world object cloned from the tech tree. */
export class ClonedWorldObject implements ClonedWorldObjectInterface {
	/**doTick? */
	private initialized = false;
	/**The unique id of the object. */
	readonly id: number = Utility.snowflake();
	/**The objects data that is static. */
	readonly base: WorldObjectBase;
	/**The cloned model of the object for displaying in world. */
	readonly model: Model;
	/**The dynamic data for the object. */
	readonly vars = new Map<string, Bin<unknown>>();
	/**Components */
	readonly components = new Map<string, ClonedWorldObjectComponent>();
	/**True if all components are functioning as needed. */
	enabled = new Bin<boolean>(true);
	/**Updates enabled status */
	private updateEnabled(value: boolean | undefined) {
		if (value === false) {
			this.enabled.set(false);
			return;
		} else {
			for (const [_, compoent] of this.components) {
				if (compoent.enabled.get() === true) continue;
				this.enabled.set(false);
				return;
			}
			this.enabled.set(true);
			return;
		}
	}
	/**Cretaes compoents and sets up the object. */
	constructor(base: WorldObjectBase) {
		this.base = base;
		this.model = this.base.model.Clone();
		for (const c of this.base.components) {
			const component = TechTree.getInstance().get(TechTreeTypes.WorldObjectComponent, c);
			if (!WorldObjectComponent(component)) {
				continue;
			}
			const com = new ClonedWorldObjectComponent(component as WorldObjectComponentBase, this);
			this.components.set(component.name, com);
			com.enabled.changed.connect((value) => this.updateEnabled(value));
		}
		this.enabled.set(true);
	}
	/**Runs on every frame to update the object. */
	Tick(dt: number) {
		if (!this.initialized) return;
		this.base.tick(dt, this);
		for (const [_, component] of this.components) {
			component.Tick(dt);
		}
	}
	/**Runs when the object is placed in the world for the first time. */
	Initialize() {
		if (this.initialized) return;
		this.base.initialize(this);
		for (const [_, component] of this.components) {
			component.Initialize();
		}
		this.initialized = true;
	}
	/**Runs when the object is deconstructed. */
	Destroy() {
		this.base.destroy(this);
		for (const [_, component] of this.components) {
			component.Destroy();
		}
		this.model.Destroy();
	}
}

/**A active component cloned from the TechTree */
export class ClonedWorldObjectComponent implements ClonedWorldObjectComponentInterface {
	/**The static data from the tech tree. */
	readonly base: WorldObjectComponentBase;
	/**The dynamic variables for the component. */
	readonly vars = new Map<string, Bin<unknown>>();
	/** the linked world object */
	readonly object: ClonedWorldObject;
	/**The components status to show to the client. */
	status = new Bin<string>("Enabled.");
	/**True if the component is functioning as needed. */
	enabled = new Bin<boolean>(true);
	/**Sets initial values and returns a new instance of this component. */
	constructor(base: WorldObjectComponentBase, object: ClonedWorldObject) {
		this.base = base;
		this.object = object;
		this.enabled.set(true);
	}
	/**Ticks on every frame to update the component. */
	Tick(dt: number) {
		this.base.tick(dt, this);
	}
	/**Runs when the connected world object is initialized. */
	Initialize() {
		this.base.initialize(this);
	}
	/**Runs when the connected world object is destroyed. */
	Destroy() {
		this.base.destroy(this);
	}
}
