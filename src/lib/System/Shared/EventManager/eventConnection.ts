import { IEvent } from "./types";

/**The connection for a spicific callback on an event. */
export class EventConnection {
	private readonly Event: IEvent;
	/**@hidden */
	readonly Callback: Callback;
	/**@hidden */
	readonly once: boolean;

	/**Disconnects the callback from its linked event. */
	Disconnect(): boolean {
		return this.Event.Disconnect(this);
	}

	/**@hideconstructor */
	constructor(callback: Callback, event: IEvent, once: boolean) {
		this.Callback = callback;
		this.Event = event;
		this.once = once;
	}
}
