import { RunService, UserInputService } from "@rbxts/services";
import { IEvent } from "../event-manager/types";
import { IInputAction, IInputManager } from "./types";
import { EventManager } from "../event-manager";

/**
 * The primary container for input events.
 */
export class InputManager {
	/**
	 * The singleton for this class.
	 */
	private static instance: IInputManager;

	/**
	 * Holds all the input events for each given KeyCode.
	 */
	private Input = new Map<Enum.KeyCode, IEvent[]>();

	/**
	 * Connects input events when ran on the Client.
	 */
	private constructor() {
		if (RunService.IsServer()) return;
		UserInputService.InputBegan.Connect((input: InputObject) => {
			const Events = this.Input.get(input.KeyCode);
			if (!Events) return;
			for (const event of Events) {
				event.Fire();
			}
		});
	}

	/**
	 * Gets the singleton for this class for use in pultiple files.
	 * @returns The singleton for this class.
	 */
	public static getInstance(): IInputManager {
		if (InputManager.instance === undefined) InputManager.instance = new InputManager();

		return InputManager.instance;
	}

	/**
	 * Attaches events to KeyCodes.
	 * @param inputAction The input action containing the Event and attached KeyCodes.
	 */
	public RegisterActionCodes(inputAction: IInputAction): IInputAction {
		for (const keyCode of inputAction.KeyCodes) {
			let binding = this.Input.get(keyCode);
			if (!binding) {
				binding = [];
				this.Input.set(keyCode, binding);
			}
			if (binding.findIndex((event) => event === inputAction.Event) !== -1) continue;
			binding.push(inputAction.Event);
		}
		return inputAction;
	}

	/**
	 * Disconnects all connections on a InputAction and removes it from the manager.
	 * @param inputAction The input action to remove and disconnect.
	 */
	public RemoveAction(inputAction: IInputAction): void {
		for (const [button, connection] of inputAction.Buttons) {
			if (connection.leftClick) connection.leftClick.Disconnect();
			if (connection.rightClick) connection.rightClick.Disconnect();
			inputAction.Buttons.delete(button);
		}
		for (const keyCode of inputAction.KeyCodes) {
			const binding = this.Input.get(keyCode);
			if (!binding) {
				continue;
			}
			binding.remove(binding.indexOf(inputAction.Event));
			if (binding.size() === 0) {
				this.Input.delete(keyCode);
			}
		}
		EventManager.getInstance().Remove(inputAction.Event.id);
	}

	/**
	 * Clears KeyCode events for the InputAction and reloads them.
	 * @param inputAction The input action to reload.
	 */
	public updateAction(inputAction: IInputAction): IInputAction {
		for (const [_, keyCodeSet] of this.Input) {
			keyCodeSet.remove(keyCodeSet.findIndex((event) => event === inputAction.Event));
		}
		return this.RegisterActionCodes(inputAction);
	}
}
