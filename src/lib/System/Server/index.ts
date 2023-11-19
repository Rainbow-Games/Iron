import { Console } from "../../Utility/console";
import { ServerManager as ServerManagerSingleton } from "./SeverManager";
import { TickManager as TickManagerSingleton } from "./TickManager";
import { WorldObjectManager as WorldObjectManagerSingleton } from "./WorldObjectManager";
import { StateManager as StateManagerSingleton } from "./StateManager";
import { AssetManager as AssetManagerSingleton } from "./AssetManager";
import { Link } from "./Network";
import { EnumTree } from "../../Enum";

export class Server {
	private static instance: Server;
	static getInstance(): Server {
		if (this.instance === undefined) this.instance = new Server();
		return this.instance;
	}

	log = Console.Debug("Iron.Server");
	WorldObjectManager: WorldObjectManagerSingleton;
	TickManager: TickManagerSingleton;
	ServerManager: ServerManagerSingleton;
	StateManager: StateManagerSingleton;
	AssetManager: AssetManagerSingleton;

	/**
	 * Creates a Link for communicating with clients.
	 * @param identifier The unique identifier for this link.
	 * @returns The new link that was made.
	 */
	CreateLink(identifier: string | EnumTree.InternalNetworkCommand): Link {
		return new Link(identifier);
	}

	private constructor() {
		const startTime = os.clock();
		this.log.Log("Server Initialization has begun!", "Iron.Initialize()");
		this.ServerManager = ServerManagerSingleton.getInstance();
		this.StateManager = StateManagerSingleton.getInstance();
		this.TickManager = TickManagerSingleton.getInstance();
		this.WorldObjectManager = WorldObjectManagerSingleton.getInstance();
		this.AssetManager = AssetManagerSingleton.getInstance();
		this.TickManager.Start();
		this.log.Log(
			`Server Initialization has finished!  Startup took ${math.round((os.clock() - startTime) * 1000)}ms.`,
			"Iron.Initialize()",
		);
		this.log.Print().close();
	}
}
