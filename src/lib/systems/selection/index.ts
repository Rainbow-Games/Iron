import Roact from "@rbxts/roact";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { Bin } from "../../bin";
import { Link } from "../../link";
import { WorldObjectBase } from "../../tech-tree/world-object/types";
import { ViewManager } from "../../tech-tree/view";
import { InputAction, InputManager } from "../input";

export class ToolTip {
	CurrentMount: Roact.Tree | undefined;
	private object = new Bin<Instance | undefined>(undefined);
	private objectData = new Bin<WorldObjectBase | undefined>(undefined);
	private ViewManager = ViewManager.getInstance();
	private create: (object: WorldObjectBase, pos: UDim2) => Roact.Element;
	private infoOpened: string | undefined = undefined;
	private roots = [Workspace.WaitForChild("@rbxts/iron").WaitForChild("WorldObjects")];

	clear() {
		if (this.CurrentMount) Roact.unmount(this.CurrentMount);
		this.CurrentMount = undefined;
	}

	render(value: Instance | undefined) {
		if (!value) return this.clear();

		this.objectData.set(
			Link.getInstance().invoke(
				{ cmd: Link.getInstance().InternalCommands.GetObjectById, player: undefined },
				tonumber(value.Name),
			) as WorldObjectBase,
		);

		const Mouse = Players.LocalPlayer.GetMouse();
		if (this.CurrentMount) Roact.unmount(this.CurrentMount);
		if (this.objectData.get())
			this.CurrentMount = Roact.mount(
				this.create(this.objectData.get() as WorldObjectBase, new UDim2(0, Mouse.X, 0, Mouse.Y)),
				Players.LocalPlayer.WaitForChild("PlayerGui").WaitForChild("@rbxts/iron"),
			);
	}

	constructor(interactKey: Enum.KeyCode[], tooltip: (object: WorldObjectBase, pos: UDim2) => Roact.Element) {
		this.object.changed.connect((value) => this.render(value));
		this.create = tooltip;
		Players.LocalPlayer.GetMouse().Move.Connect(() => this.castRay());
		InputManager.getInstance()
			.RegisterActionCodes(new InputAction(interactKey))
			.Event.Connect(() => {
				if (this.object.get() !== undefined && this.infoOpened === undefined) {
					this.ViewManager.open(`WorldObject/${this.object.get()?.Name as string}/Interface`);
					this.infoOpened = `WorldObject/${this.object.get()?.Name as string}/Interface`;
				} else if (this.infoOpened !== undefined) {
					this.ViewManager.close(this.infoOpened);
					this.infoOpened = undefined;
				}
			});
	}

	private castRay() {
		const Mouse = Players.LocalPlayer.GetMouse();
		if (this.CurrentMount) Roact.unmount(this.CurrentMount);
		const camera = Workspace.CurrentCamera;
		if (!camera) return this.clear();
		const unitRay = camera.ViewportPointToRay(Mouse.X, Mouse.Y);
		const raycastParams = new RaycastParams();

		raycastParams.FilterType = Enum.RaycastFilterType.Include;
		raycastParams.FilterDescendantsInstances = this.roots;
		const raycastResult = Workspace.Raycast(unitRay.Origin, unitRay.Direction.mul(20), raycastParams);

		if (!raycastResult) return this.clear();

		if (this.objectData.get())
			this.CurrentMount = Roact.mount(
				this.create(this.objectData.get() as WorldObjectBase, new UDim2(0, Mouse.X, 0, Mouse.Y)),
				Players.LocalPlayer.WaitForChild("PlayerGui").WaitForChild("@rbxts/iron"),
			);

		let object: Instance = raycastResult.Instance;
		while (!this.roots.find((o) => o === object.Parent)) {
			if (object.Parent === undefined) return this.clear();
			object = object.Parent;
		}
		this.object.set(object as Model);
	}
}
