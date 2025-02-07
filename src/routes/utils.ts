import { DateTime } from 'luxon';

export function create_slots(events) {
	const slots = {};

	const newSlotEvents = Object.fromEntries(
		Object.entries(events).filter(([key, value]) => {
			return value[2] === 'new-slot';
		})
	);

	const today = DateTime.now().setZone('utc+0', { keepLocalTime: true }).startOf('day');

	for (let i = 0; i < 60; i++) {
		const day = today.plus({ days: i }) as DateTime;

		const dayStr = day.toISO().slice(0, 10);
		if (![1, 2, 5].includes(day.weekday) && !(dayStr in newSlotEvents)) {
			continue;
		}
		const item = {
			id: i,
			day: dayStr,
			month: day.month,
			// date: day.toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
			date: day.toJSDate(),
			status: 'ok',
			adding_slot: false,
			refs: {}
		};

		// let cancelled_day = new Date(2024, 0, 19);
		// if (day.toDateString() == cancelled_day.toDateString()) {
		//     item.status = "cancelled";
		// }

		slots[item.day] = item;
	}

	return slots;
}

export const timeslots = [];
for (let i = 0; i < 4; i++) {
	timeslots.push(`${18 + i}:00`);
	timeslots.push(`${18 + i}:30`);
}
timeslots.push(`22:00`);

export function capitalize(val) {
	return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
