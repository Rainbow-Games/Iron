export class Bin<T> {
	private _value: T | undefined = undefined;
	set(value: T | undefined) {
		this._value = value;
		this.changed.fire(value);
	}
	get(): T | undefined {
		return this._value;
	}
	changed = new PropertyChangedEvent<T>();
}

export class PropertyChangedEvent<T> {
	private id = 0;
	private connections = new Map<number, (value: T | undefined) => void>();
	connect(callback: (value: T | undefined) => void): number {
		this.id += 1;
		this.connections.set(this.id, callback);
		return this.id;
	}
	disconnect(id: number): void {
		this.connections.delete(id);
	}
	fire(value: T | undefined): void {
		for (const [_, callback] of this.connections) {
			task.spawn(() => callback(value));
		}
	}
}
