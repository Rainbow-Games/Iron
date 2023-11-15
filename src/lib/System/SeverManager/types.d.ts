export interface IServerManager {
	readonly serverId: number;
	readonly machine: string;

	/**
	 * Makes a unique id for an object.
	 * @returns A unique id.
	 */
	snowflake(): number;

	/**
	 * Shutsdown the server and moves all players to another server (or kicks if in studio).
	 */
	shutdown(): void;
}
