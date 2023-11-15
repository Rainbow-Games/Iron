import { EventManager } from "../event-manager";
import { InputManager } from ".";
import { IButtonProps, IInputAction } from "./types";
import { IEvent } from "../event-manager/types";

/**
 * Allows for connecting events to KeyCodes or Buttons.
 */
export class InputAction implements IInputAction {
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
	Event: IEvent = EventManager.getInstance().Add();

	/**
	 * @param buttons The buttons to connect to. Undefined will connect none.
	 * @param keyCodes The KeyCodes that can fire the event. Undefined will connect none.
	 */
	constructor(
		keyCodes: Enum.KeyCode[] | undefined = undefined,
		buttons: Map<GuiButton, IButtonProps> | undefined = undefined,
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
	addButton(button: GuiButton, props: IButtonProps): void {
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
