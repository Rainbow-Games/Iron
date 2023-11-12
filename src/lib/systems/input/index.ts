import { RunService, UserInputService } from "@rbxts/services";
import { Event, EventManager } from "../event";
import { ButtonProps } from "./types";

/**
 * The primary container for input events.
 */
export class InputManager {
	/**
	 * The singleton for this class.
	 */
	private static instance: InputManager;

	/**
	 * Holds all the input events for each given KeyCode.
	 */
	private Input = new Map<Enum.KeyCode, Event[]>();

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
	public static getInstance(): InputManager {
		if (InputManager.instance === undefined) InputManager.instance = new InputManager();

		return InputManager.instance;
	}

	/**
	 * Attaches events to KeyCodes.
	 * @param inputAction The input action containing the Event and attached KeyCodes.
	 */
	public RegisterActionCodes(inputAction: InputAction): InputAction {
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
	public RemoveAction(inputAction: InputAction): void {
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
	public updateAction(inputAction: InputAction): InputAction {
		for (const [_, keyCodeSet] of this.Input) {
			keyCodeSet.remove(keyCodeSet.findIndex((event) => event === inputAction.Event));
		}
		return this.RegisterActionCodes(inputAction);
	}
}

/**
 * Allows for connecting events to KeyCodes or Buttons.
 */
export class InputAction {
	/**
	 * All connected KeyCodes that can fire the event.
	 */
	KeyCodes: Enum.KeyCode[] = [];

	/**
	 * All connected Buttons that can fire the event on click.
	 */
	Buttons = new Map<
		GuiButton,
		{
			leftClick: RBXScriptConnection | undefined;
			rightClick: RBXScriptConnection | undefined;
		}
	>();

	/**
	 * The Event used to connect to the input action and is fired on key press or button click.
	 */
	Event: Event = EventManager.getInstance().Add();

	/**
	 * @param buttons The buttons to connect to. Undefined will connect none.
	 * @param keyCodes The KeyCodes that can fire the event. Undefined will connect none.
	 */
	constructor(
		keyCodes: Enum.KeyCode[] | undefined = undefined,
		buttons: Map<GuiButton, ButtonProps> | undefined = undefined,
	) {
		if (buttons !== undefined) {
			for (const [button, props] of buttons) this.addButton(button, props);
		}
		if (keyCodes !== undefined) {
			this.KeyCodes = keyCodes;
		}
		InputManager.getInstance().RegisterActionCodes(this);
	}

	/**
	 * Removes this InputAction and disconnects all connections.
	 */
	destroy(): void {
		InputManager.getInstance().RemoveAction(this);
	}

	/**
	 * Removes the connections for a given button (both left and right buttons).
	 * @param button The button to remove connections for.
	 */
	removeButton(button: GuiButton): void {
		const connection = this.Buttons.get(button);
		if (!connection) return;
		if (connection.leftClick) connection.leftClick.Disconnect();
		if (connection.rightClick) connection.rightClick.Disconnect();
		this.Buttons.delete(button);
		return;
	}

	/**
	 * Adds connections to a Button on the Gui.
	 * @param button The button to connect clicks to.
	 * @param props The mouse click types that can fire the event.
	 */
	addButton(button: GuiButton, props: ButtonProps): void {
		let buttonData = this.Buttons.get(button);
		if (!buttonData) buttonData = { leftClick: undefined, rightClick: undefined };
		if (props.useLeftMouse) buttonData.leftClick = button.MouseButton1Click.Connect(() => this.Event.Fire());
		if (props.useRightMouse) buttonData.leftClick = button.MouseButton2Click.Connect(() => this.Event.Fire());
		if (buttonData.leftClick === undefined && buttonData.rightClick === undefined) {
			this.Buttons.delete(button);
			return;
		}
		this.Buttons.set(button, buttonData);
	}

	/**
	 * Disconnects the event from given KeyCodes.
	 * @param keyCodes The KeyCodes to remove from this event.
	 */
	removeBindings(keyCodes: Enum.KeyCode[]): void {
		for (const keyCode of keyCodes) {
			this.KeyCodes.remove(this.KeyCodes.findIndex((code) => code === keyCode));
		}
		InputManager.getInstance().updateAction(this);
	}

	/**
	 * Adds connections to KeyCodes.
	 * @param keyCodes The KeyCodes to add to this event.
	 */
	addBindings(keyCodes: Enum.KeyCode[]): void {
		for (const keyCode of keyCodes) {
			if (this.KeyCodes.findIndex((code) => code === keyCode) === -1) this.KeyCodes.push(keyCode);
		}
		InputManager.getInstance().updateAction(this);
	}
}
