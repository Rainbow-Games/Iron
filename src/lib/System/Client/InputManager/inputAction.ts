import { EventManager } from "../../Shared/EventManager";
import { InputManager } from ".";
import { IButtonProps, IInputAction } from "./types";
import { IEvent } from "../../Shared/EventManager/types";
import { EnumTree } from "../../../Enum";
import { Players } from "@rbxts/services";

/**
 * Allows for connecting events to KeyCodes or Buttons.
 */
export class InputAction implements IInputAction {
	/**
	 * All connected KeyCodes that can fire the event.
	 */
	KeyCodes: Enum.KeyCode[] = [];

	InputActions: { connection: RBXScriptConnection; name: EnumTree.InputActionType }[] = [];

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
		inputActions: EnumTree.InputActionType[] | undefined = undefined,
	) {
		if (buttons !== undefined) {
			for (const [button, props] of buttons) this.addButton(button, props);
		}
		if (keyCodes !== undefined) {
			this.KeyCodes = keyCodes;
		}
		if (inputActions !== undefined) {
			this.addInputAction(inputActions);
		}
		InputManager.getInstance().RegisterActionCodes(this);
	}

	/**
	 * Removes this InputAction and disconnects all connections.
	 */
	destroy(): void {
		const actions: EnumTree.InputActionType[] = [];
		this.InputActions.forEach((o) => actions.push(o.name));
		this.removeInputAction(actions);
		InputManager.getInstance().RemoveAction(this);
	}

	addInputAction(actions: EnumTree.InputActionType[]) {
		for (const action of actions) {
			const storedAction = this.InputActions.find((o) => o.name === action);
			if (storedAction !== undefined) continue;
			switch (action) {
				case EnumTree.InputActionType.MouseButton1Down:
					this.InputActions.push({
						name: action,
						connection: Players.LocalPlayer.GetMouse().Button1Down.Connect(() => {
							this.Event.Fire();
						}),
					});
					break;
				case EnumTree.InputActionType.MouseButton2Down:
					this.InputActions.push({
						name: action,
						connection: Players.LocalPlayer.GetMouse().Button1Down.Connect(() => {
							this.Event.Fire();
						}),
					});
					break;
				case EnumTree.InputActionType.MouseMove:
					this.InputActions.push({
						name: action,
						connection: Players.LocalPlayer.GetMouse().Move.Connect(() => {
							this.Event.Fire();
						}),
					});
					break;
				default:
					break;
			}
		}
	}

	removeInputAction(actions: EnumTree.InputActionType[]) {
		for (const action of actions) {
			const storedAction = this.InputActions.find((o) => o.name === action);
			if (storedAction === undefined) continue;
			storedAction.connection.Disconnect();
			this.InputActions.remove(this.InputActions.indexOf(storedAction));
		}
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
