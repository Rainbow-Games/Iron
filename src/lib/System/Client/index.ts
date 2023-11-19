import { EnumTree } from "../../Enum";
import { Link } from "./Network";
import { InputManager as InputManagerSingleton } from "./InputManager";
import { Console } from "../../Utility/console";
import { AssetLoader as AssetLoaderSingleton } from "./AssetLoader";
import { PlacementManager as PlacementManagerSingleton } from "./PlacementManager";

export class Client {
	private static instance: Client;
	static getInstance(): Client {
		if (this.instance === undefined) this.instance = new Client();
		return this.instance;
	}

	InputManager: InputManagerSingleton;
	AssetLoader: AssetLoaderSingleton;
	PlacementManager: PlacementManagerSingleton;

	/**
	 * Creates a Link for communicating with the server.
	 * @param identifier The unique identifier for this link.
	 * @returns The new link that was made.
	 */
	CreateLink(identifier: string | EnumTree.InternalNetworkCommand): Link {
		return new Link(identifier);
	}

	private constructor() {
		const startTime = os.clock();
		const log = Console.Debug("Iron Initialization");
		log.Log("Client Initialization has begun!", "Iron.Initialize()");
		this.InputManager = InputManagerSingleton.getInstance();
		this.AssetLoader = AssetLoaderSingleton.getInstance();
		this.PlacementManager = PlacementManagerSingleton.getInstance();
		log.Log(
			`Client Initialization has finished!  Startup took ${math.round((os.clock() - startTime) * 1000)}ms.`,
			"Iron.Initialize()",
		);
		log.Print().close();
	}
}

// Exports the InputAction class for InputManager use.
export { InputAction } from "./InputManager/inputAction";
