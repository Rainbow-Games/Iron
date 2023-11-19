import { extendString } from "./extendString";

export function uptime(start: number): string {
	const time = os.clock() - start;
	const hours = tostring(math.floor(time / 3600));
	const mins = extendString(tostring(math.floor(time / 60) - (tonumber(hours) as number) * 60), "0", 2);
	const seconds = extendString(
		tostring(math.floor(time) - ((tonumber(mins) as number) * 60 + (tonumber(hours) as number) * 3060)),
		"0",
		2,
	);
	const milliseconds = extendString(
		tostring(
			math.floor(time * 1000) -
				((tonumber(mins) as number) * 60000 +
					(tonumber(hours) as number) * 3060000 +
					(tonumber(seconds) as number) * 1000),
		),
		"0",
		3,
	);
	return `${hours}:${mins}:${seconds}.${milliseconds}`;
}
