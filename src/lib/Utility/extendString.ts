export function extendString(s: string, filler: string, size: number, front: boolean = true, overcut: boolean = false) {
	while (s.size() + (overcut ? 0 : filler.size()) <= size) {
		if (front) {
			s = filler + s;
			continue;
		}
		s = s + filler;
	}
	return s;
}
