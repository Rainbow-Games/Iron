import { t } from "@rbxts/t";

export const WorldObject = t.interface({
	name: t.string,
	display: t.string,
	discription: t.string,
	icon: t.string,
	model: t.instanceOf("Model"),
	components: t.array(t.string),
	tick: t.callback,
	initialize: t.callback,
	destroy: t.callback,
});

export const WorldObjectComponent = t.interface({
	name: t.string,
	display: t.string,
	discription: t.string,
	icon: t.string,
	tick: t.callback,
	initialize: t.callback,
	destroy: t.callback,
});

export const Item = t.interface({
	name: t.string,
	display: t.string,
	discription: t.string,
	icon: t.string,
	model: t.instanceOf("Model"),
	maxQuantity: t.number,
});

export const WorldObjectItem = t.interface({
	name: t.string,
	display: t.string,
	discription: t.string,
	icon: t.string,
	recipe: t.any,
	model: t.instanceOf("Model"),
	worldObject: WorldObject,
	maxQuantity: t.number,
});

export const DurrabilityItem = t.interface({
	name: t.string,
	display: t.string,
	discription: t.string,
	icon: t.string,
	model: t.instanceOf("Model"),
	maxQuantity: t.number,
	break: t.callback,
});

export const DecayingItem = t.interface({
	name: t.string,
	display: t.string,
	discription: t.string,
	icon: t.string,
	model: t.instanceOf("Model"),
	maxQuantity: t.number,
	break: t.callback,
	rate: t.number,
});

export const ToolItem = t.interface({
	name: t.string,
	display: t.string,
	discription: t.string,
	icon: t.string,
	model: t.instanceOf("Model"),
	maxQuantity: t.number,
	break: t.callback,
	factor: t.number,
	leftClick: t.callback,
	rightClick: t.callback,
});

export const ItemTypes = [Item, WorldObjectItem, DurrabilityItem, DecayingItem, ToolItem];

export const ItemStack = t.interface({
	name: t.union(...ItemTypes),
	quantity: t.number,
});

export const DurrabilityItemStack = t.interface({
	name: t.union(...ItemTypes),
	quantity: t.number,
	durrability: t.number,
});

export const ItemStackTypes = [ItemStack, DurrabilityItemStack];

export const TechTreeTypes = {
	WorldObject: 1,
	WorldObjectComponent: 2,
	Item: 3,
	Recipe: 4,
};
