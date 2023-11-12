import { RunService } from "@rbxts/services";

/**
 * [iteration, time]
 */
let iteration = 0;
let last = "";

/**
 * Makes a unique id for an object.
 * @returns A unique id.
 */
export function snowflake(): number {
	const time = DateTime.now().FormatUniversalTime("YYYYMMDDhmmss", "en-us");
	if (time !== last) {
		last = time;
		iteration = 0;
	} else {
		iteration += 1;
	}
	return tonumber(`${iteration}${time}`) ?? 0;
}

export function OnlyServer(object: object, propertyName: string, description: TypedPropertyDescriptor<Callback>) {
	const method = description.value;

	description.value = function (this, ...args: unknown[]) {
		assert(RunService.IsServer(), `Method ${propertyName} can't be called on client.`);
		return method(this, ...args);
	};

	return description;
}

export function OnlyClient(object: object, propertyName: string, description: TypedPropertyDescriptor<Callback>) {
	const method = description.value;

	description.value = function (this, ...args: unknown[]) {
		assert(RunService.IsClient(), `Method ${propertyName} can't be called on server.`);
		return method(this, ...args);
	};

	return description;
}
