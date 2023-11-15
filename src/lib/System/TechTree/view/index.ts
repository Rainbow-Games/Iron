import Roact from "@rbxts/roact";
import { Bin } from "../../bin";
import { ViewManagerClassInterface, ViewInterface, ClonedViewInterface } from "./types";
import { Players, RunService } from "@rbxts/services";
import { TechTreeTypes, View } from "../t";
import { t } from "@rbxts/t";
import { Link } from "../../net/old-index";
import { ClonedWorldObject, ClonedWorldObjectComponent, WorldObjectManager } from "../world-object";
import { WorldObjectComponentBase } from "../world-object/types";
import { TechTree } from "..";

export class ViewManager implements ViewManagerClassInterface {
	private opened: { view: ClonedView; mount: Roact.Tree }[] = [];
	private serverOpened: { player: Player; view: ClonedView }[] = [];
	private Link = Link.getInstance();
	private TechTree = TechTree.getInstance();
	private WorldObjectManager = WorldObjectManager.getInstance();
	load(player: Player | undefined = undefined, loaded: unknown = 0) {
		if (RunService.IsClient()) {
			for (;;) {
				print(loaded);
				if (!t.number(loaded)) continue;
				const view = this.Link.invoke({ cmd: this.Link.InternalCommands.LoadView, player: undefined }, loaded);
				print(view);
				if (view === undefined) break;
				this.TechTree.add(TechTreeTypes.View, view);
				loaded += 1;
			}
		} else {
			print(loaded);
			if (!t.number(loaded)) return;
			const e = this.TechTree.getAll(this.TechTree.Types.View)[loaded];
			print(`techTree: ${this.TechTree.getAll(this.TechTree.Types.View)}!`);
			return e;
		}
	}
	open(link: unknown, player: Player | undefined = undefined) {
		if (RunService.IsClient()) {
			const view = this.Link.invoke({ cmd: this.Link.InternalCommands.OpenView, player: undefined }, link) as
				| ClonedView
				| undefined;
			if (!view) return;
			const base = this.TechTree.get(this.TechTree.Types.View, view.base.name);
			if (!View(base)) {
				this.Link.fire({ cmd: this.Link.InternalCommands.CloseView, player: undefined }, view.link);
				return;
			}
			view.base = base as ViewBase;
			if (view.base.render === true || view.base.render === false) {
				this.Link.fire({ cmd: this.Link.InternalCommands.CloseView, player: undefined }, view.link);
				return;
			}
			const tree = Roact.mount(
				view.base.render.get()(view.props),
				Players.LocalPlayer.WaitForChild("PlayerGui").WaitForChild("@rbxts/iron"),
			);
			this.opened.push({ view: view, mount: tree });
		} else {
			if (!player || !t.string(link)) return;
			if (this.serverOpened.find((o) => o.player === player && o.view.link === link)) return;
			let WorldObject: ClonedWorldObject | undefined;
			let Component: ClonedWorldObjectComponent | undefined;
			const components: WorldObjectComponentBase[] = [];
			let view: ClonedView;
			switch (link.split("/")[0]) {
				case "WorldObject":
					WorldObject = this.WorldObjectManager?.get(tonumber(link.split("/")[1]) ?? -1);
					if (!WorldObject) break;
					switch (link.split("/")[2]) {
						case "Interface":
							if (WorldObject.base.view === undefined) break;
							view = new ClonedView(WorldObject.base.view, link);
							for (const [key, bin] of WorldObject.vars) {
								if (!bin.syncToView) continue;
								view.props.set(key, bin.get());
								bin.changed.connect(() => this.update(view));
							}
							view.props.set("base", WorldObject.base);
							WorldObject.components.forEach((c) => components.push(c.base));
							view.props.set("components", components);
							view.props.set("enabled", WorldObject.enabled.get());
							this.serverOpened.push({ player: player, view: view });
							return view;
						case "Component":
							Component = WorldObject.components.get(link.split("/")[3]);
							if (!Component) break;
							if (Component.base.view === undefined) break;
							view = new ClonedView(Component.base.view, link);
							for (const [key, bin] of Component.vars) {
								if (!bin.syncToView) continue;
								view.props.set(key, bin.get());
								bin.changed.connect(() => this.update(view));
							}
							view.props.set("base", Component.base);
							view.props.set("status", Component.status.get());
							view.props.set("enabled", Component.enabled.get());
							view.props.set("object", Component.object.base);
							this.serverOpened.push({ player: player, view: view });
							return view.props;
						default:
							break;
					}
					break;
				default:
					break;
			}
		}
	}
	private update(view: ClonedViewInterface) {
		if (view.props.get("LastMoo") === undefined) return;
		print(
			`Last Moo: ${math.round(
				(DateTime.now().UnixTimestampMillis - (view.props.get("LastMoo") as number)) / 1000,
			)} seconds ago`,
		);
	}
	close(link: unknown, player: Player | undefined = undefined) {
		if (!t.string(link)) return;
		if (RunService.IsClient()) {
			const view = this.opened.find((o) => o.view.link === link);
			if (!view) return;
			Roact.unmount(view.mount);
			this.Link.fire({ cmd: this.Link.InternalCommands.CloseView, player: undefined }, view.view.link);
			this.opened.remove(this.opened.findIndex((O) => O === view));
		} else {
			const view = this.serverOpened.find((o) => o.player === player && o.view.link === link);
			if (!view) return;
			this.serverOpened.remove(this.serverOpened.findIndex((o) => o === view));
		}
	}
	private constructor() {
		if (RunService.IsServer()) {
			this.Link.setCallback(this.Link.InternalCommands.LoadView, (player, loaded) =>
				this.load(player as Player, loaded),
			);
			this.Link.setCallback(this.Link.InternalCommands.OpenView, (player, link) =>
				this.open(link, player as Player),
			);
			this.Link.connect(this.Link.InternalCommands.CloseView, (player, link) =>
				this.close(link, player as Player),
			);
			this.Link.setCallback(this.Link.InternalCommands.GetObjectById, (player, id) => {
				return this.WorldObjectManager?.get(id as number)?.base;
			});
		}
	}
	private static instance: ViewManager;
	static getInstance(): ViewManager {
		if (!this.instance) this.instance = new ViewManager();
		return this.instance;
	}
}

export abstract class ViewBase implements ViewInterface {
	abstract name: string;
	abstract layer: number;
	render: Bin<(props: Map<string, unknown> | undefined) => Roact.Element> | boolean = false;
}

class ClonedView implements ClonedViewInterface {
	readonly link: string;
	base: ViewBase;
	layer: number;
	props = new Map<string, unknown>();
	constructor(base: ViewBase, link: string) {
		this.base = base;
		this.layer = this.base.layer;
		this.link = link;
	}
}
