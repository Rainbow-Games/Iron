import { IEvent } from "../../Shared/EventManager/types";

export interface IButtonProps {
	useLeftMouse: boolean;
	useRightMouse: boolean;
}

/**
 * Allows for connecting events to KeyCodes or Buttons.
 */
export interface IInputAction {
	/**
	 * All connected KeyCodes that can fire the event.
	 */
	KeyCodes: Enum.KeyCode[];

	/**
	 * All connected Buttons that can fire the event on click.
	 */
	Buttons: Map<
		GuiButton,
		{
			leftClick: RBXScriptConnection | undefined;
			rightClick: RBXScriptConnection | undefined;
		}
	>;

	/**
	 * The Event used to connect to the input action and is fired on key press or button click.
	 */
	Event: IEvent;

	/**
	 * Removes this InputAction and disconnects all connections.
	 */
	destroy(): void;

	/**
	 * Removes the connections for a given button (both left and right buttons).
	 * @param button The button to remove connections for.
	 */
	removeButton(button: GuiButton): void;

	/**
	 * Adds connections to a Button on the Gui.
	 * @param button The button to connect clicks to.
	 * @param props The mouse click types that can fire the event.
	 */
	addButton(button: GuiButton, props: IButtonProps): void;

	/**
	 * Disconnects the event from given KeyCodes.
	 * @param keyCodes The KeyCodes to remove from this event.
	 */
	removeBindings(keyCodes: Enum.KeyCode[]): void;

	/**
	 * Adds connections to KeyCodes.
	 * @param keyCodes The KeyCodes to add to this event.
	 */
	addBindings(keyCodes: Enum.KeyCode[]): void;
}

/**
 * The primary container for input events.
 */
export class IInputManager {
	/**
	 * Gets the singleton for this class for use in pultiple files.
	 * @returns The singleton for this class.
	 */
	public static getInstance(): IInputManager;

	/**
	 * Attaches events to KeyCodes.
	 * @param inputAction The input action containing the Event and attached KeyCodes.
	 */
	public RegisterActionCodes(inputAction: IInputAction): IInputAction;

	/**
	 * Disconnects all connections on a InputAction and removes it from the manager.
	 * @param inputAction The input action to remove and disconnect.
	 */
	public RemoveAction(inputAction: IInputAction): void;

	/**
	 * Clears KeyCode events for the InputAction and reloads them.
	 * @param inputAction The input action to reload.
	 */
	public updateAction(inputAction: IInputAction): IInputAction;
}
