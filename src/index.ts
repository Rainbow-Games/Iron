import { Config as IronConfigClass } from "./lib/System/Shared/Config";
import { Client as client } from "./lib/System/Client";
import { Server as server } from "./lib/System/Server";
import { EventManager as EventManagerSingleton } from "./lib/System/Shared/EventManager";
import { TechTree as TechTreeSingleton } from "./lib/System/Shared/TechTree";
import { Console as console } from "./lib/Utility/console";
import { EnumTree } from "./lib/Enum";
import { RunService } from "@rbxts/services";

/**"Iron, it's in every factory game!" */
namespace Iron {
	/**Configure Iron Though this */
	export const Config = IronConfigClass.getInstance();
	export const EventManager = EventManagerSingleton.getInstance();
	export const TechTree = TechTreeSingleton.getInstance();
	export const Server = (RunService.IsServer() ? server.getInstance() : undefined) as server;
	export const Client = (RunService.IsClient() ? client.getInstance() : undefined) as client;
	export const Console = console;
	export const Enum = EnumTree;
}

// Exports the Iron namespace.
export default Iron;

// Export WorldObject types.
export {
	TickableWorldObject,
	DefaultTickableWorldObject,
} from "./lib/System/Server/WorldObjectManager/WorldObjectTypes/TickableWorldObject";
export { WorldObject, DefaultWorldObject } from "./lib/System/Server/WorldObjectManager/WorldObjectTypes/WorldObject";
export {
	DefaultWorldObjectState,
	DefaultTickableWorldObjectState,
	TickableWorldObjectState,
} from "./lib/System/Server/WorldObjectManager/WorldObjectTypes/DefaultState";

// Export WorldObjectComponent types.
export {
	TickableWorldObjectComponent,
	DefaultTickableWorldObjectComponent,
} from "./lib/System/Server/WorldObjectManager/ComponentTypes/TickableWorldObjectComponent";
export {
	WorldObjectComponent,
	DefaultWorldObjectComponent,
} from "./lib/System/Server/WorldObjectManager/ComponentTypes/WorldObjectComponent";
export {
	DefaultWorldObjectComponentState,
	DefaultTickableWorldObjectComponentState,
	TickableWorldObjectComponentState,
} from "./lib/System/Server/WorldObjectManager/ComponentTypes/DefaultState";

// Export asset types.
export { Asset } from "./lib/System/Shared/AssetTypes";
export { IconAsset } from "./lib/System/Shared/AssetTypes/icon";
export { ModelAsset } from "./lib/System/Shared/AssetTypes/model";
export { WorldObjectModelAsset } from "./lib/System/Shared/AssetTypes/worldObjectModel";
