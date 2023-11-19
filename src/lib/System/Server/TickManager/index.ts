import { t } from "@rbxts/t";
import { EnumTree } from "../../../Enum";
import { Console } from "../../../Utility/console";
import { Config } from "../../Shared/Config";
import { StateManager } from "../StateManager";
import { TechTree } from "../../Shared/TechTree";
import { TickableWorldObjectComponentState } from "../WorldObjectManager/ComponentTypes/DefaultState";
import { TickableWorldObjectComponent } from "../WorldObjectManager/ComponentTypes/TickableWorldObjectComponent";
import { TickableWorldObjectState } from "../WorldObjectManager/WorldObjectTypes/DefaultState";
import { TickableWorldObject } from "../WorldObjectManager/WorldObjectTypes/TickableWorldObject";

namespace Errors {
	export function ObjectNotOnTechTree(name: string) {
		return `Attempted to tick object "${name}" that was not on the TechTree.`;
	}
	export function TickFailed(errorMessage: string | undefined = undefined) {
		return "Tick exited with an error" + (errorMessage !== undefined ? ": " + errorMessage : ".");
	}
}

export class TickManager {
	private static instance: TickManager;
	private constructor() {}
	readonly log = Console.Debug("Iron.TickManager");

	static getInstance(): TickManager {
		if (this.instance === undefined) this.instance = new TickManager();
		return this.instance;
	}
	private techTree = TechTree.getInstance();
	private stateManager = StateManager.getInstance();
	private initialized = false;

	/**
	 * Stored callbacks to reduce the need to lookup the tick functions every time something ticks.
	 */
	private callbacks = new Map<string, Callback>();

	/**
	 * Do Tick?
	 */
	private tickEnabled: boolean = false;

	/**
	 * Runs callbacks in a safe maner so if one tick fails it does not stop the entire game.
	 * @param callback The function to run.
	 * @param args Arguments for the function.
	 */
	private run(callback: Callback, ...args: unknown[]): void {
		try {
			callback(...args);
		} catch (error) {
			if (!t.string(error)) {
				this.log.Warn(Errors.TickFailed(), "Iron.TickManager.run()", "Error");
				return;
			}
			this.log.Warn(Errors.TickFailed(error), "Iron.TickManager.run()", "Error");
		}
	}

	/**
	 * Ticks a WorldObjectComponent and adds the callback to the manager.
	 * @param dt The delta time of the tick.
	 * @param component The state of the component to tick.
	 */
	private TickWorldObjectComponent(dt: number, component: TickableWorldObjectComponentState): void {
		if (!component.initialized) return;
		const storedBase = this.callbacks.get(component.name);
		if (!storedBase) {
			const base = this.techTree.get(
				component.name,
			) as TickableWorldObjectComponent<TickableWorldObjectComponentState>;
			if (base === undefined) {
				this.log.Warn(
					Errors.ObjectNotOnTechTree(component.name),
					"Iron.TickManager.TickWorldObjectComponent()",
					"Error",
				);
				return;
			}
			this.callbacks.set(component.name, (component: TickableWorldObjectComponentState, dt: number) => {
				base.tick(dt, component);
			});
			this.run(() => base.tick(dt, component));
			return;
		}
		this.run(storedBase, dt, component);
	}

	/**
	 * Ticks a WorldObject and adds the callback to the manager.
	 * @param dt The delta time of the tick.
	 * @param worldObject The state of the WorldObject to tick.
	 */
	private TickWorldObject(dt: number, worldObject: TickableWorldObjectState): void {
		if (!worldObject.initialized) return;
		const storedBase = this.callbacks.get(worldObject.name);
		if (!storedBase) {
			const base = this.techTree.get(worldObject.name) as TickableWorldObject<TickableWorldObjectState>;
			if (base === undefined) {
				Errors.ObjectNotOnTechTree(worldObject.name);
				return;
			}
			this.callbacks.set(worldObject.name, (dt: number, worldObject: TickableWorldObjectState) => {
				base.tick(dt, worldObject);
			});
			this.run(() => base.tick(dt, worldObject));
			return;
		}
		this.run(storedBase, dt, worldObject);
	}

	/**
	 * Ticks all tickable objects.
	 * @param lastTick The start time of the last tick. Used to calculate the ticks delta time.
	 */
	private Tick(lastTick: number): void {
		if (!this.tickEnabled) return;
		let dt = os.clock() - lastTick;
		lastTick = os.clock();

		// Tick world object components
		for (const worldObjectComponent of this.stateManager.filterByIdentifiers(
			EnumTree.StateIdentifier.WorldObjectComponent,
			EnumTree.StateIdentifier.Tickable,
		) as unknown as TickableWorldObjectComponentState[]) {
			this.TickWorldObjectComponent(dt, worldObjectComponent);
		}

		// Tick world objects
		for (const worldObject of this.stateManager.filterByIdentifiers(
			EnumTree.StateIdentifier.WorldObject,
			EnumTree.StateIdentifier.Tickable,
		) as TickableWorldObjectState[]) {
			this.TickWorldObject(dt, worldObject);
		}

		dt = os.clock() - lastTick;
		task.delay(1 / Config.getInstance().UpdatesPerSecond - dt - 0.01, () => this.Tick(lastTick));
	}

	/**
	 * Starts Ticking of all tickable world objects and components.
	 */
	Start(): void {
		if (this.tickEnabled) return;
		if (this.initialized) {
			return this.Resume();
		}
		this.tickEnabled = true;
		task.spawn(() => this.Tick(os.clock()));
		this.initialized = true;
		Console.Debug("Iron Initialization").Log(
			"Iron.TickManager has initialized and is ticking",
			"Iron.TickManager.Start()",
		);
	}

	/**
	 * Starts Ticking of all tickable world objects and components.
	 */
	Resume(): void {
		if (this.tickEnabled) return;
		this.tickEnabled = true;
		task.spawn(() => this.Tick(os.clock()));
		Console.Debug("Iron Initialization").Log(
			"Iron.TickManager has initialized and is ticking",
			"Iron.TickManager.Start()",
		);
	}

	/**
	 * Stops Ticking of all tickable world objects and components.
	 */
	Stop(): void {
		this.tickEnabled = false;
	}
}
