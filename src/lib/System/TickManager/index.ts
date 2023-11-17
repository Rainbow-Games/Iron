import { EnumTree } from "../../Enum";
import { RunsOn } from "../../Utility/Decorators/runsOn";
import { Console } from "../../Utility/console";
import { Config } from "../Config";
import { StateManager } from "../StateManager";
import { TechTree } from "../TechTree";
import {
	DefaultTickableWorldObjectComponentState,
	TickableWorldObjectComponent,
} from "../WorldObjectManager/ComponentTypes/TickableWorldObjectComponent";
import {
	DefaultTickableWorldObjectState,
	TickableWorldObject,
} from "../WorldObjectManager/WorldObjectTypes/TickableWorldObject";

namespace Errors {
	export function ObjectNotOnTechTree(name: string) {
		Console.Warn(`Attempted to tick object "${name}" that was not on the TechTree`);
	}
}

export class TickManager {
	private static instance: TickManager;
	private constructor() {
		this.Tick(os.clock());
	}

	@RunsOn(EnumTree.RunType.Server)
	static getInstance(): TickManager {
		if (this.instance === undefined) this.instance = new TickManager();
		return this.instance;
	}
	private techTree = TechTree.getInstance();
	private stateManager = StateManager.getInstance();

	private storage = new Map<string, Callback>();

	private tickEnabled: boolean = false;

	private Tick(lastTick: number) {
		let dt = os.clock() - lastTick;
		lastTick = os.clock();

		if (!this.tickEnabled) {
			dt = os.clock() - lastTick;
			task.delay(1 / Config.getInstance().UpdatesPerSecond - dt - 0.01, () => this.Tick(lastTick));
			return;
		}

		// Tick world object components
		for (const worldObjectComponent of this.stateManager.filterByIdentifiers(
			EnumTree.StateIdentifier.WorldObjectComponent,
			EnumTree.StateIdentifier.Tickable,
		) as DefaultTickableWorldObjectComponentState[]) {
			const component = this.techTree.get(
				worldObjectComponent.name,
			) as TickableWorldObjectComponent<DefaultTickableWorldObjectComponentState>;
			if (component === undefined) {
				Errors.ObjectNotOnTechTree(worldObjectComponent.name);
				continue;
			}
			component.tick(worldObjectComponent, dt);
		}

		// Tick world objects
		for (const worldObject of this.stateManager.filterByIdentifiers(
			EnumTree.StateIdentifier.WorldObject,
			EnumTree.StateIdentifier.Tickable,
		) as DefaultTickableWorldObjectState[]) {
			const object = this.techTree.get(worldObject.name) as TickableWorldObject<DefaultTickableWorldObjectState>;
			if (object === undefined) {
				Errors.ObjectNotOnTechTree(worldObject.name);
				continue;
			}
			object.tick(worldObject, dt);
		}

		dt = os.clock() - lastTick;
		task.delay(1 / Config.getInstance().UpdatesPerSecond - dt - 0.01, () => this.Tick(lastTick));
	}
}
