/**World objects are objects players can place in the world. */
export abstract class IWorldObject<State> {
	/**The system name for the object */
	abstract name: string;
	/**The name the player sees */
	abstract display: string;
	/**The discription the player sees */
	abstract discription: string;
	/**The icon for the object */
	abstract icon: string;
	/**The objects model */
	abstract model: Model;
	/**The objects state */
	abstract state: State;
}
