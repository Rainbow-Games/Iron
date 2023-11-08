/**This can be anything that is created and inherits properties from the node. */
export interface TechTreeNodeMember {
	/**The unique name of the member used in game systems. */
	name: string;
	/**The node of the TechTree the member inherits from.  Similar to Roblox's ClassName. */
	node: string;
}
