export function move<T>(items: T[], index: number, delta: number) {
	const target = index + delta;
	if (index < 0 || index >= items.length || target < 0 || target >= items.length) return items;
	const result = [...items];
	[result[index], result[target]] = [result[target], result[index]];
	return result;
}

export function stageNeighbor(items: { stage: string }[], index: number, delta: -1 | 1) {
	for (let target = index + delta; target >= 0 && target < items.length; target += delta) {
		if (items[target].stage === items[index].stage) return target;
	}
	return index;
}
