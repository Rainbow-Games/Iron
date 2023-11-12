/**
 * Manages all events in the game.
 */
export class EventManager {
	private constructor() {}

	/**
	 * The singliton container.
	 */
	private static instance: EventManager;

	/**
	 * Gets the EventManager singleton.
	 * @returns The EventManager singleton.
	 */
	public static getInstance(): EventManager {
		if (!this.instance) {
			this.instance = new EventManager();
		}
		return this.instance;
	}

	/**
	 * All the events in the EventManager.
	 */
	private Events = new Map<number, Event>();

	/**
	 * Finds and returns the next availible id.
	 * @returns The next availible id.
	 */
	private AssignId(): number {
		let id = 0;
		for (const [i, _] of this.Events) {
			if (i === id + 1) {
				id += 1;
				continue;
			} else {
				id += 1;
				return id;
			}
		}
		return id;
	}

	/**
	 * Creates an event.
	 * @returns The event made
	 */
	public Add(): Event {
		const id = this.AssignId();
		const event = new Event(id);
		this.Events.set(id, event);
		return event;
	}

	/**
	 * Removes the event with the given id.
	 * @param id The number id of the event.
	 * @returns If found and removed.
	 */
	public Remove(id: number): boolean {
		const event = this.Events.get(id);
		if (!event) return false;
		for (const connection of event.Connections) {
			connection.Disconnect();
		}
		this.Events.delete(id);
		return true;
	}

	/**
	 * Gets an event with the given id.
	 * @param id The number id of the event.
	 * @returns The event found if any.
	 */
	public Get(id: number): Event | undefined {
		return this.Events.get(id);
	}
}

/**Events can allow cross script communication; */
export class Event {
	/**unique id of event */
	readonly id: number;

	/**@hidden */
	readonly Connections: EventConnection[] = [];

	/**
	 * Fires all connections.
	 * @param args The arguments for the event.
	 */
	Fire(...args: []) {
		for (const connection of this.Connections) {
			task.spawn(() => connection.Callback(...args));
			if (!connection.once) continue;
			this.Disconnect(connection);
		}
	}

	/**@hidden */
	Disconnect(connection: EventConnection): boolean {
		const index = this.Connections.findIndex((v) => v === connection);
		if (index === -1) return false;
		this.Connections.remove(index);
		return true;
	}

	/**
	 * Fires a callback every time the event fires.
	 * @param callback The callback to fire.
	 * @returns The connection's data.
	 */
	Connect(callback: Callback): EventConnection {
		const connection = new EventConnection(callback, this, false);
		this.Connections.push(connection);
		return connection;
	}

	/**
	 * Fires a callback next time the event fires.
	 * @param callback The callback to fire.
	 * @returns The connection's data.
	 */
	Once(callback: Callback): EventConnection {
		const connection = new EventConnection(callback, this, true);
		this.Connections.push(connection);
		return connection;
	}

	/**@hideconstructor */
	constructor(id: number) {
		this.id = id;
	}
}

/**The connection for a spicific callback on an event. */
export class EventConnection {
	private readonly Event: Event;
	/**@hidden */
	readonly Callback: Callback;
	/**@hidden */
	readonly once: boolean;

	/**Disconnects the callback from its linked event. */
	Disconnect(): boolean {
		return this.Event.Disconnect(this);
	}

	/**@hideconstructor */
	constructor(callback: Callback, event: Event, once: boolean) {
		this.Callback = callback;
		this.Event = event;
		this.once = once;
	}
}
