import { EventManager } from "../EventManager";
import { IValue } from "./types";

export class Value<T> implements IValue<T> {
	private _value: T;

	/**
	 * Saves value on serialization if enabled.
	 */
	Serialized: boolean;

	set(value: T) {
		if (value === this._value) return;
		this._value = value;
		this.changed.Fire(value);
	}

	get(): T {
		return this._value;
	}

	changed = EventManager.getInstance().Add();

	constructor(initialValue: T, serialized: boolean = false) {
		this.Serialized = serialized;
		this._value = initialValue;
	}
}
