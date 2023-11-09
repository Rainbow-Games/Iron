import { CombineStates } from "@rbxts/reflex";
import { PlayerGuis } from "./player-gui";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
	PlayerGuis: PlayerGuis,
};
