import { t } from "@rbxts/t";

export const Serializable = t.union(t.number, t.string, t.array(t.union(t.number, t.string)));
