import { TechTreeNodeMember } from "./types";

/**The main container for object types and classes. */
class TechTreeClass {
	/**All the nodes in the tree. */
	private readonly nodes = new Map<string, Node<TechTreeNodeMember>>();
	find<NodeType extends TechTreeNodeMember>(name: string): Node<NodeType> | undefined {
		return this.nodes.get(name) as Node<NodeType> | undefined;
	}
	/**
	 * Adds a Node to the TechTree
	 * @param name The name of the node to make. Will act like a ClassName for members.
	 * @returns True if it did not exist and was created. False if it already exists.
	 */
	registerNode<T extends TechTreeNodeMember>(name: string): boolean {
		if (this.find(name)) {
			return false;
		}
		const node = new Node<T>(name);
		this.nodes.set(name, node);
		return true;
	}
}

/**A node is a type of object that can have multiple types inherit from it below. */
export class Node<T extends TechTreeNodeMember> {
	/**The nodes name. think of this as a ClassName */
	public readonly name: string;
	/**The members below the node that have additional properties ontop of the nodes. */
	private readonly members = new Map<string, T>();
	/**
	 * Finds the member with the given name.
	 * @param name The name of the member to find.
	 * @returns the member found if any.
	 */
	find(name: string): T | undefined {
		return this.members.get(name);
	}
	/**
	 * Adds a member to the node.
	 * @param member The member to insert into the node.
	 * @returns True if it did not exist and was created. False if it already exists.
	 */
	registerMember(member: T): boolean {
		if (this.find(member.name)) {
			return false;
		}
		member.node = this.name;
		this.members.set(member.name, member);
		return true;
	}
	constructor(name: string) {
		this.name = name;
	}
}

export const TechTree = new TechTreeClass();
