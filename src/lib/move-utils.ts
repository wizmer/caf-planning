export function getMoveColor(type: Move['type']) {
	const colors = {
		hand_start: 'bg-green-500',
		foot_start: 'bg-amber-400',
		hand: 'bg-blue-500',
		foot: 'bg-orange-500',
		both: 'bg-purple-500',
		finish: 'bg-pink-500'
	};
	return colors[type];
}

export function getMoveBorderColor(type: Move['type']) {
	const colors = {
		hand_start: 'border-green-500',
		foot_start: 'border-amber-400',
		hand: 'border-blue-500',
		foot: 'border-orange-500',
		both: 'border-purple-500',
		finish: 'border-pink-500'
	};
	return colors[type];
}

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
