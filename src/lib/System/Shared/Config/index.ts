import { ReplicatedStorage } from "@rbxts/services";
import { EnumTree } from "../../../Enum";
import { InputAction } from "../../Client";

export class Config {
	private static instance: Config;
	private constructor() {}
	static getInstance(): Config {
		if (this.instance === undefined) this.instance = new Config();
		return this.instance;
	}

	UpdatesPerSecond = 20;
	PrintLogsStudio = true;
	PrintLogsPublished = false;
	InlineLogsIndent = 70;
	PacketLogsCap = 10;
	ViewRange = 40;
	ManipulationRange = 20;
	readonly PlaceAction = [EnumTree.InputActionType.MouseButton1Down];
	readonly DestroyAction = [EnumTree.InputActionType.MouseButton2Down];
	readonly UpdateGhostAction = [EnumTree.InputActionType.MouseMove];
	FallbackWorldObjectModel = new Instance("Model");
	GridSize = new Vector3(4, 4, 4);
}

Config.getInstance().FallbackWorldObjectModel.Name = "FALLBACK";
const part = new Instance("Part");
part.Size = new Vector3(4, 4, 4);
part.Color = Color3.fromRGB(0, 0, 0);
part.Material = Enum.Material.ForceField;
part.Parent = Config.getInstance().FallbackWorldObjectModel;
part.Anchored = true;
Config.getInstance().FallbackWorldObjectModel.PrimaryPart = part;
