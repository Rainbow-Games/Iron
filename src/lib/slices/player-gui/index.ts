import { createProducer } from "@rbxts/reflex";
import { PlayerGuiState } from "./types";
import { ItemStackBase } from "../../tech-tree/item/types";

class initialState implements PlayerGuiState {
	ToolbarSlots = new Map<number, ItemStackBase | undefined>();
	ToolbarSize = 7;
	InventorySlots = new Map<number, ItemStackBase | undefined>();
	InventorySize = 21;
	SideButtons = new Map<number, { link: string; icon: string }>();
	LinkView: unknown;
}

export const PlayerGuis = createProducer(new initialState(), {
	addButton: (state, id: number, button: { link: string; icon: string }) => ({
		...state,
		SideButtons: (() => {
			state.SideButtons.set(id, button);
			return state.SideButtons;
		})(),
	}),
});
