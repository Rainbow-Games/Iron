// **OLD SYSTEM: PENDING REWORK**

import Roact from "@rbxts/roact";
import { Bin } from "../../bin";

export interface ViewManagerClassInterface {
	load(player: Player): void;
	open(link: string, player: Player | undefined): ClonedViewInterface | void;
	close(link: string): void;
}

export interface ViewInterface {
	name: string;
	layer: number;
}

export interface ClonedViewInterface {
	link: string;
	base: ViewInterface;
	layer: number;
	props: Map<string, unknown>;
}
