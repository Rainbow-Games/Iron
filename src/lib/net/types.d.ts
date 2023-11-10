/**Creates links between the client and server. */
export abstract class NetLinkInterface {
	/**
	 * Fires an event on the other side with the given command.
	 * @param data Player is only needed for firing clients. command is allways needed.
	 * @param args Any arguments passed into the event.
	 */
	fire(data: { player: Player | undefined; cmd: number }, ...args: unknown[]): void;
	/**
	 * Runs a function on the other side with the given command.
	 * @param data Player is only needed for firing clients. command is allways needed.
	 * @param args Any arguments passed into the function.
	 */
	invoke(data: { player: Player | undefined; cmd: number }, ...args: unknown[]): unknown;
	/**
	 * Connects a event to a command.
	 * @param cmd The command to connect to.
	 * @param callback The function to run when fired.
	 * @returns The connection id for disconnecting.
	 */
	connect(cmd: number, callback: (...args: unknown[]) => void): number;
	/**
	 * Disconnects a connection.
	 * @param id The id of the connection to disconnect from.
	 */
	disconnect(id: number): void;
	/**
	 * Connects to a command to run on fired first then auto disconnect.
	 * @param cmd The command to connect to.
	 * @param callback The function to run when fired.
	 */
	once(cmd: number, callback: (...args: unknown[]) => void): void;
	/**
	 * Sets a command to use a given callback. only one callback per command.
	 * @param cmd The command to set.
	 * @param callback The callback to set the command to
	 */
	setCallback(cmd: number, callback: (...args: unknown[]) => unknown): void;
}
