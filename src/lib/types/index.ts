export interface Move {
	index: number;
	wallId: number;
	type: 'foothold' | 'handhold' | 'both' | 'start' | 'top';
	x: number;
	y: number;
}
