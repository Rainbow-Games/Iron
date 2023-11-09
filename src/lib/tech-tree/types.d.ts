export interface TechTreeInterface {
	add(techType: number, object: unknown): boolean;
	get(techType: number, name: string): unknown;
}
