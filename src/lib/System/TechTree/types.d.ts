export interface TechTreeInterface {
	add(techType: number, object: unknown): boolean;
	get(techType: number, name: string): unknown;
	getAll(techType: number): defined[];
	Types: {
		WorldObject: number;
		WorldObjectComponent: number;
		Item: number;
		Recipe: number;
		View: number;
	};
}
