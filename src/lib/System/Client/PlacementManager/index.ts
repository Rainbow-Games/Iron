import { Players, Workspace } from "@rbxts/services";
import { EnumTree } from "../../../Enum";
import { InputAction } from "../InputManager/inputAction";
import { PlacementGhost } from "./ghost";
import { Config } from "../../Shared/Config";
import { Link } from "../Network";

/**
 * The primary building placement script
 */
export class PlacementManager {
	/**
	 * The singleton for this class.
	 */
	private static instance: PlacementManager;
	private constructor() {
		this.startKey.Event.Connect(() => this.start());
		this.stopKey.Event.Connect(() => this.stop());
		this.updateKey.Event.Connect(() => this.updateGhost());
		this.placeKey.Event.Connect(() => this.place());
	}
	public static getInstance(): PlacementManager {
		if (this.instance === undefined) this.instance = new PlacementManager();
		return this.instance;
	}

	private active: boolean = false;
	private startKey = new InputAction([Enum.KeyCode.B], undefined, undefined);
	private stopKey = new InputAction([Enum.KeyCode.X], undefined, undefined);
	private updateKey = new InputAction(undefined, undefined, [EnumTree.InputActionType.MouseMove]);
	private placeKey = new InputAction(undefined, undefined, [EnumTree.InputActionType.MouseButton1Down]);
	private worldObjects = Workspace.WaitForChild("@rbxts/iron").WaitForChild("WorldObjects") as Folder;

	private ghost = PlacementGhost.getInstance();

	private link = new Link("Placement");

	private place() {
		if (!this.active) {
			const player = Players.LocalPlayer;
			const mouse = player.GetMouse();
			if (mouse.Target && mouse.Target.IsDescendantOf(this.worldObjects)) {
				let object: Instance = mouse.Target;
				for (;;) {
					if (object.Parent === this.worldObjects) break;
					object = object.Parent as Instance;
				}
				if (object.Name === "0") return;
				this.link.Fire(tonumber(object.Name));
			}
			return;
		}
		if (this.ghost.model === undefined) return;
		if (this.ghost.model.WorldPivot.Y === -1000) return;
		this.link.Invoke({
			name: this.ghost.type,
			pos: [this.ghost.model.WorldPivot.X, this.ghost.model.WorldPivot.Y, this.ghost.model.WorldPivot.Z, 0],
		});
		wait();
		this.updateGhost();
	}

	set(name: string) {
		if (this.ghost.type === name) return;
		if (this.active) {
			this.stop();
			this.ghost.set(name);
			this.start();
		} else {
			this.ghost.set(name);
		}
	}

	start() {
		if (this.active || this.ghost.type === "") return;
		this.active = true;
		this.ghost.show();
		this.updateGhost();
	}

	stop() {
		if (!this.active || this.ghost.type === "") return;
		this.active = false;
		this.ghost.hide();
	}

	private updateGhost() {
		if (this.ghost.model === undefined || !this.active) return;

		const player = Players.LocalPlayer;

		const mouse = player.GetMouse();
		mouse.TargetFilter = this.ghost.model;
		if (!mouse.Target) {
			this.ghost.model.PivotTo(new CFrame(new Vector3(0, -1000, 0)));
			return;
		}
		let pos = mouse.Target.Position.div(Config.getInstance().GridSize);
		switch (mouse.TargetSurface) {
			case Enum.NormalId.Top:
				pos = pos.add(new Vector3(0, 0.6, 0));
				break;
			case Enum.NormalId.Bottom:
				pos = pos.add(new Vector3(0, -0.6, 0));
				break;
			case Enum.NormalId.Left:
				pos = pos.add(new Vector3(-0.6, 0, 0));
				break;
			case Enum.NormalId.Right:
				pos = pos.add(new Vector3(0.6, 0, 0));
				break;
			case Enum.NormalId.Front:
				pos = pos.add(new Vector3(0, 0, -0.6));
				break;
			case Enum.NormalId.Back:
				pos = pos.add(new Vector3(0, 0, 0.6));
				break;
		}
		pos = new Vector3(math.round(pos.X), math.round(pos.Y), math.round(pos.Z)).mul(Config.getInstance().GridSize);
		this.ghost.model.PivotTo(new CFrame(pos));
	}
}
