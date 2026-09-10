import { describe, expect, it } from 'vitest';
import { DateTime } from 'luxon';
import { create_slots, get_hour_labels, get_timeslots, RECURRING_DAYS } from './utils';

describe('get_timeslots', () => {
	it('génère la grille du samedi 9-13, bornes incluses, zéro-padée', () => {
		expect(get_timeslots(9, 13)).toEqual([
			'09:00',
			'09:30',
			'10:00',
			'10:30',
			'11:00',
			'11:30',
			'12:00',
			'12:30',
			'13:00'
		]);
	});

	it('conserve la grille du soir 18-22', () => {
		expect(get_timeslots(18, 22)).toEqual([
			'18:00',
			'18:30',
			'19:00',
			'19:30',
			'20:00',
			'20:30',
			'21:00',
			'21:30',
			'22:00'
		]);
	});

	it('est triée lexicalement (comparaisons du template valides)', () => {
		const grid = get_timeslots(9, 13);
		expect(grid).toEqual([...grid].sort());
	});
});

describe('get_hour_labels', () => {
	it('retourne une étiquette par heure pleine, fin exclue', () => {
		expect(get_hour_labels(9, 13)).toEqual(['09:00', '10:00', '11:00', '12:00']);
		expect(get_hour_labels(18, 22)).toEqual(['18:00', '19:00', '20:00', '21:00']);
	});
});

describe('create_slots', () => {
	const values = Object.values(create_slots({}));

	it('inclut lun, mar, ven et sam (≥ 8 occurrences chacun sur 60 jours)', () => {
		for (const weekday of [1, 2, 5, 6]) {
			const count = values.filter((slot) => slot.weekday === weekday).length;
			expect(count).toBeGreaterThanOrEqual(8);
		}
	});

	it('exclut mercredi, jeudi et dimanche', () => {
		for (const weekday of [3, 4, 7]) {
			expect(values.some((slot) => slot.weekday === weekday)).toBe(false);
		}
	});

	it('expose une weekday couverte par RECURRING_DAYS', () => {
		for (const slot of values) {
			expect(RECURRING_DAYS[slot.weekday]).toBeDefined();
		}
	});

	it('ajoute un jour ponctuel new-slot même hors jours récurrents', () => {
		let target = DateTime.now()
			.setZone('utc+0', { keepLocalTime: true })
			.startOf('day')
			.plus({ days: 5 });
		while (target.weekday !== 3) target = target.plus({ days: 1 });
		const dayStr = target.toISO().slice(0, 10);
		const slots = create_slots({ [dayStr]: [1, dayStr, 'new-slot'] });
		expect(slots[dayStr]).toBeDefined();
		expect(slots[dayStr].weekday).toBe(3);
	});
});
