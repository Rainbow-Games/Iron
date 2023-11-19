import { EventConnection } from "./eventConnection";

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
	Fire(...args: unknown[]) {
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

	/**
	 * Yeilds thread until the event fires.
	 */
	Wait(): void {
		let pass = false;
		this.Once(() => {
			pass = true;
		});
		while (!pass) wait();
	}

	/**@hideconstructor */
	constructor(id: number) {
		this.id = id;
	}
}
