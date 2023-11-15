import { EventManager } from "../EventManager";

export class Bin<T> {
	private _value: T;
	syncToView: boolean = false;
	set(value: T) {
		if (value === this._value) return;
		this._value = value;
		this.changed.Fire(value);
	}
	get(): T {
		return this._value;
	}
	changed = EventManager.getInstance().Add();
	constructor(initialValue: T) {
		this._value = initialValue;
	}
}
