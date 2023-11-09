/**An item type */
export abstract class ItemBase {
	/**The system name */
	name: string;
	/**The name shown to the player */
	display: string;
	/**The items discription shown to the player */
	discription: string;
	/**The items model when droped or held (drops at players hand suggestion is to use a collision group different then the player) */
	model: Model;
	/**The items icon */
	icon: string;
	/**The max stack size for the item */
	maxQuantity: number;
}

/**An item type linked to a world object (allows to place the world object when held) */
export abstract class WorldObjectItemBase extends ItemBase {
	/**The world object linked */
	worldObject: string;
}

/**Allows for systems like decay and tools */
export abstract class DurrabilityItemBase extends ItemBase {
	/**action at zero durrability */
	break: (item: DurrabilityItemBase) => void;
}

/**Item durrability lowers over time */
export abstract class DecayingItemBase extends DurrabilityItemBase {
	/**decay per day */
	rate: number;
}

/**Tools */
export abstract class ToolItemBase extends DurrabilityItemBase {
	/**durrability use per hit */
	factor: number;
	/**event on left click */
	leftClick: (mouse: Mouse, item: DurrabilityItemBase) => void;
	/**event on right click or mobile tap */
	rightClick: (mouse: Mouse, item: DurrabilityItemBase) => void;
}

/**Item stack */
export abstract class ItemStackBase {
	/**A unique id for the item stack */
	id: number;
	/**The item in the stack */
	item: ItemBase | WorldObjectItemBase;
	/**How much of that item is in the stack */
	quantity: number;
}

/**Durrability Item Stacks */
export abstract class DurrabilityItemStackBase extends ItemStackBase {
	/**durrability out of 100 */
	durrability: number;
}
