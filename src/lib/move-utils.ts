export function getMoveLabel(type: Move['type']) {
	const labels = {
		hand_start: 'Hand Start',
		foot_start: 'Foot Start',
		hand: 'Hand',
		foot: 'Foot',
		both: 'Both',
		finish: 'Finish'
	};
	return labels[type];
}
