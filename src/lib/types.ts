export interface Move {
	id: string;
	index: number;
	wallId: number;
	type: 'hand_start' | 'foot_start' | 'hand' | 'foot' | 'both' | 'finish';
	x: number;
	y: number;
}
