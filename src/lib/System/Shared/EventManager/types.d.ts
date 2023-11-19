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
	 * Yeilds thread until the event fires.
	 */
	Wait(): void;

	/**
	 * Fires a callback next time the event fires.
	 * @param callback The callback to fire.
	 * @returns The connection's data.
	 */
	Once(callback: Callback): IEventConnection;
}
