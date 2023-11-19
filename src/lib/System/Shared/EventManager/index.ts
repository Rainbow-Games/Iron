import { Event } from "./event";

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
		if (this.instance === undefined) this.instance = new EventManager();
		return this.instance;
	}

	private nextId: number = 0;

	/**
	 * All the events in the EventManager.
	 */
	private Events = new Map<number, Event>();

	/**
	 * Creates an event.
	 * @returns The event made
	 */
	public Add(): Event {
		const event = new Event(this.nextId++);
		this.Events.set(event.id, event);
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
