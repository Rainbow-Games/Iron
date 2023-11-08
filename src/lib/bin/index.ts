import { snowflake } from "../utility";

/**A Bin for holding data and connecting to value changes. */
export class Bin<VarType> {
	/**A unique id for the bin. */
	id = snowflake();

	/**The value of the bin. */
	private _value: VarType;

	/**The connection id so connections can be removed. */
	private cid: number = 0;

	/**Bins that this bin contains. */
	private readonly _bins = new Map<string, Bin<unknown>>();

	/**Callbacks to run on value change. */
	private readonly connections = new Map<number, (value: VarType) => void>();

	/**Middleware can modify the value before setting it or cancel the proccess as a whole. */
	private middleware: (value: VarType) => VarType | undefined = (value) => value;

	/**Sets the initial value */
	constructor(value: VarType) {
		this._value = value;
	}

	/**
	 * Gets a bin from inside the bin.
	 * @param name The name of the bin to get.
	 * @returns The bin found if any.
	 */
	getBin<T>(name: string): Bin<T> | undefined {
		return this._bins.get(name) as Bin<T> | undefined;
	}

	/**
	 * Create a new bin within this bin for holding multiple values.
	 * @param name The name of the bin to create.
	 * @param data The initial value to set the bin to.
	 * @returns this.
	 */
	setBin(name: string, data: unknown): Bin<VarType> {
		this._bins.set(name, new Bin<unknown>(data));
		return this;
	}

	/**
	 * Gets the current value.
	 * @returns The value of this bin.
	 */
	get(): VarType {
		return this._value;
	}

	/**
	 * Sets the current bins data.
	 * @param data The data to set the value to.
	 * @returns this.
	 */
	set(data: VarType): Bin<VarType> {
		const output = this.middleware(data);
		if (output === undefined) return this;
		for (const [_, connection] of this.connections) {
			connection(output);
		}
		this._value = output;
		return this;
	}

	/**
	 * Connects a callback to value change.
	 * @param callback The callback to call on value change.
	 * @returns An id to disconnect with.
	 */
	connect(callback: (value: VarType) => void): number {
		this.cid += 1;
		this.connections.set(this.cid, callback);
		return this.cid;
	}

	/**
	 * Disconnects a callback from value change.
	 * @param cid The id given on connection creation.
	 * @returns this.
	 */
	disconnect(cid: number): Bin<VarType> {
		this.connections.delete(cid);
		return this;
	}

	/**
	 * Sets a validation function for value changes.
	 * @param callback The callback to use to validate value changes.
	 * @returns this.
	 */
	setMiddleware(callback: (value: VarType) => VarType | undefined): Bin<VarType> {
		this.middleware = callback;
		return this;
	}

	/**
	 * exposes the bins value to the other side and updates it on value changes.
	 * @param name A name for the value that will be displayed on the other side.
	 * @returns this.
	 */
	expose(name: string): Bin<VarType> {
		return this;
	}
}
