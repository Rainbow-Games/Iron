/**The connection for a spicific callback on an event. */
export interface IEventConnection {
	/**@hidden */
	readonly Callback: Callback;
	/**@hidden */
	readonly once: boolean;
	/**Disconnects the callback from its linked event. */
	Disconnect(): boolean;
}

/**Events can allow cross script communication; */
export interface IEvent {
	/**unique id of event */
	readonly id: number;

	/**@hidden */
	readonly Connections: IEventConnection[];

	/**
	 * Fires all connections.
	 * @param args The arguments for the event.
	 */
	Fire(...args: unknown[]): void;

	/**@hidden */
	Disconnect(connection: IEventConnection): boolean;

	/**
	 * Fires a callback every time the event fires.
	 * @param callback The callback to fire.
	 * @returns The connection's data.
	 */
	Connect(callback: Callback): IEventConnection;

	/**
	 * Fires a callback next time the event fires.
	 * @param callback The callback to fire.
	 * @returns The connection's data.
	 */
	Once(callback: Callback): IEventConnection;
}

/**
 * Manages all events in the game.
 */
export interface IEventManager {
	/**
	 * Creates an event.
	 * @returns The event made
	 */
	Add(): IEvent;

	/**
	 * Removes the event with the given id.
	 * @param id The number id of the event.
	 * @returns If found and removed.
	 */
	Remove(id: number): boolean;

	/**
	 * Gets an event with the given id.
	 * @param id The number id of the event.
	 * @returns The event found if any.
	 */
	Get(id: number): IEvent | undefined;
}
