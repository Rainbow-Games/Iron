import { ItemStackBase } from "../../tech-tree/item/types";

export interface PlayerGuiState {
	ToolbarSlots: Map<number, ItemStackBase | undefined>;
	ToolbarSize: number;
	InventorySlots: Map<number, ItemStackBase | undefined>;
	InventorySize: number;
	SideButtons: Map<number, { link: string; icon: string }>;
	LinkView: unknown;
}
