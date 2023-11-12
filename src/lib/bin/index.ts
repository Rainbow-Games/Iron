export class Bin<T> {
	private _value: T;
	syncToView: boolean = false;
	set(value: T) {
		if (value === this._value) return;
		this._value = value;
		this.changed.fire(value);
	}
	get(): T {
		return this._value;
	}
	changed = new PropertyChangedEvent<T>();
	constructor(initialValue: T) {
		this._value = initialValue;
	}
}

export class PropertyChangedEvent<T> {
	private id = 0;
	private connections = new Map<number, (value: T) => void>();
	connect(callback: (value: T) => void): number {
		this.id += 1;
		this.connections.set(this.id, callback);
		return this.id;
	}
	disconnect(id: number): void {
		this.connections.delete(id);
	}
	fire(value: T): void {
		for (const [_, callback] of this.connections) {
			task.spawn(() => callback(value));
		}
	}
}
