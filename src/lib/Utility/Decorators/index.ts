import { RunService } from "@rbxts/services";
import { EnumTree } from "../../enum";

/**
 * Error if the game is running the wrong type of instance for the code.
 * @param RunType The type of game instance the method can run on.
 */
export function RunsOn(RunType: EnumTree.RunType) {
	return function (object: object, propertyName: string, description: TypedPropertyDescriptor<Callback>) {
		const method = description.value;

		description.value = function (this, ...args: unknown[]) {
			if (RunType === EnumTree.RunType.Server)
				assert(RunService.IsServer(), `Method "${propertyName}" needs to be called on the Server.`);
			if (RunType === EnumTree.RunType.Client)
				assert(RunService.IsClient(), `Method "${propertyName}" needs to be called on the Client.`);
			if (RunType === EnumTree.RunType.Studio)
				assert(RunService.IsClient(), `Method "${propertyName}" needs to be called in Studio.`);
			return method(this, ...args);
		};

		return description;
	};
}
