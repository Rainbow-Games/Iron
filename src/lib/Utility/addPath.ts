import { Players, RunService } from "@rbxts/services";

/**
 * Initializes all files in a given directory.
 * @param paths The directorys to initialize.
 * @description THE CODE FOR THIS FUNCTION WAS MODIFIED FROM "https://github.com/rbxts-flamework/core/blob/master/src/flamework.ts" on the _addPaths() function ALL credit for this function goes to the respotory's contributers.
 */
export function initializePaths(paths: string[][]) {
	const preloadPaths = new Array<Instance>();
	for (const arg of paths) {
		const service = arg.shift();
		let currentPath: Instance = game.GetService(service as keyof Services);
		if (service === "StarterPlayer") {
			if (arg[0] !== "StarterPlayerScripts") throw "StarterPlayer only supports StarterPlayerScripts";
			if (!RunService.IsClient()) throw "The server cannot load StarterPlayer content";
			currentPath = Players.LocalPlayer.WaitForChild("PlayerScripts");
			arg.shift();
		}
		for (let i = 0; i < arg.size(); i++) {
			currentPath = currentPath.WaitForChild(arg[i]);
		}
		preloadPaths.push(currentPath);
	}
	const load = (moduleScript: ModuleScript) => {
		const [success, value] = pcall(require, moduleScript);
		if (!success) {
			throw `${moduleScript.GetFullName()} failed to preload: ${value}`;
		}
	};

	for (const path of preloadPaths) {
		if (path.IsA("ModuleScript")) {
			load(path);
		}
		for (const instance of path.GetDescendants()) {
			if (instance.IsA("ModuleScript")) {
				load(instance);
			}
		}
	}
}
