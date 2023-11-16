import { t } from "@rbxts/t";

namespace types {
	export const WorldObject = t.interface({
		name: t.string,
		display: t.string,
		discription: t.string,
		icon: t.string,
		model: t.instanceOf("Model"),
		defaultState: t.any,
		components: t.array(t.string),
		initialize: t.callback,
		destroy: t.callback,
	});

	export const TickableWorldObject = t.interface({
		name: t.string,
		display: t.string,
		discription: t.string,
		icon: t.string,
		model: t.instanceOf("Model"),
		defaultState: t.any,
		components: t.array(t.string),
		initialize: t.callback,
		destroy: t.callback,
		tick: t.callback,
	});

	export const WorldObjectTypes = t.union(WorldObject, TickableWorldObject);

	export const WorldObjectComponent = t.interface({
		name: t.string,
		display: t.string,
		discription: t.string,
		icon: t.string,
		defaultState: t.any,
		initialize: t.callback,
		destroy: t.callback,
	});

	export const TickableWorldObjectComponent = t.interface({
		name: t.string,
		display: t.string,
		discription: t.string,
		icon: t.string,
		defaultState: t.any,
		initialize: t.callback,
		destroy: t.callback,
		tick: t.callback,
	});

	export const WorldObjectComponentTypes = t.union(WorldObjectComponent, TickableWorldObjectComponent);
}

export default types;
