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
