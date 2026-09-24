import { DateTime } from 'luxon';

export interface Times {
	start: number;
	end: number;
	active?: boolean;
}

export type RecurringConfig = Record<number, Times>;

export const RECURRING_DAYS: RecurringConfig = {
	1: { start: 18, end: 22, active: true },
	2: { start: 18, end: 22, active: true },
	3: { start: 20, end: 22, active: true },
	4: { start: 18, end: 22, active: false },
	5: { start: 18, end: 22, active: true },
	6: { start: 9, end: 13, active: true },
	7: { start: 18, end: 22, active: false }
};

export const DEFAULT_TIMES: Times = { start: 18, end: 22 };

export function config_from_rows(rows): RecurringConfig {
	if (!rows || rows.length === 0) {
		return RECURRING_DAYS;
	}
	const config: RecurringConfig = {};
	for (const row of rows) {
		config[row.weekday] = { start: row.start, end: row.end, active: row.active };
	}
	return config;
}

export function get_timeslots(start: number, end: number): string[] {
	const timeslots: string[] = [];
	for (let minutes = start * 60; minutes <= end * 60; minutes += 30) {
		const h = String(Math.floor(minutes / 60)).padStart(2, '0');
		const m = String(minutes % 60).padStart(2, '0');
		timeslots.push(`${h}:${m}`);
	}
	return timeslots;
}

export function get_hour_labels(start: number, end: number): string[] {
	const labels: string[] = [];
	for (let h = start; h < end; h++) {
		labels.push(`${String(h).padStart(2, '0')}:00`);
	}
	return labels;
}

export function create_slots(events, config: RecurringConfig = RECURRING_DAYS) {
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
		const times = config[day.weekday];
		if ((!times || times.active === false) && !(dayStr in newSlotEvents)) {
			continue;
		}
		const item = {
			id: i,
			day: dayStr,
			weekday: day.weekday,
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

export function capitalize(val) {
	return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
