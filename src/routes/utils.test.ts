import { describe, expect, it } from 'vitest';
import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';
import { DateTime } from 'luxon';
import {
	config_from_rows,
	create_slots,
	get_hour_labels,
	get_timeslots,
	type RecurringConfig
} from './utils';

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
	const WEEK: RecurringConfig = {
		1: { start: 18, end: 22, active: true },
		2: { start: 18, end: 22, active: true },
		3: { start: 20, end: 22, active: true },
		4: { start: 18, end: 22, active: false },
		5: { start: 18, end: 22, active: true },
		6: { start: 9, end: 13, active: false },
		7: { start: 18, end: 22, active: false }
	};
	const values = Object.values(create_slots({}, WEEK));

	it('inclut lun, mar, mer et ven (≥ 8 occurrences chacun sur 60 jours)', () => {
		for (const weekday of [1, 2, 3, 5]) {
			const count = values.filter((slot) => slot.weekday === weekday).length;
			expect(count).toBeGreaterThanOrEqual(8);
		}
	});

	it('exclut jeudi, samedi et dimanche', () => {
		for (const weekday of [4, 6, 7]) {
			expect(values.some((slot) => slot.weekday === weekday)).toBe(false);
		}
	});

	it('expose une weekday couverte par la config', () => {
		for (const slot of values) {
			expect(WEEK[slot.weekday]).toBeDefined();
		}
	});

	it('ajoute un jour ponctuel new-slot même hors jours récurrents', () => {
		let target = DateTime.now()
			.setZone('utc+0', { keepLocalTime: true })
			.startOf('day')
			.plus({ days: 5 });
		while (target.weekday !== 3) target = target.plus({ days: 1 });
		const dayStr = target.toISO().slice(0, 10);
		const slots = create_slots({ [dayStr]: [1, dayStr, 'new-slot'] }, WEEK);
		expect(slots[dayStr]).toBeDefined();
		expect(slots[dayStr].weekday).toBe(3);
	});
});

describe('create_slots avec config custom', () => {
	const config = {
		1: { start: 14, end: 16, active: true },
		6: { start: 9, end: 13, active: false }
	};
	const values = Object.values(create_slots({}, config));

	it("n'inclut que les jours actifs de la config", () => {
		expect(values.some((slot) => slot.weekday === 6)).toBe(false);
		expect(values.every((slot) => slot.weekday === 1)).toBe(true);
	});

	it('traite un flag active manquant comme actif', () => {
		const implicit = Object.values(create_slots({}, { 5: { start: 10, end: 12 } }));
		expect(implicit.every((slot) => slot.weekday === 5)).toBe(true);
		expect(implicit.length).toBeGreaterThanOrEqual(8);
	});
});

describe('config_from_rows', () => {
	it('normalise les lignes DB en config', () => {
		const config = config_from_rows([
			{ weekday: 3, start: 20, end: 22, active: true },
			{ weekday: 4, start: 18, end: 22, active: false }
		]);
		expect(config[3]).toEqual({ start: 20, end: 22, active: true });
		expect(config[4]).toEqual({ start: 18, end: 22, active: false });
	});

	it('retourne une config vide si la table est vide', () => {
		expect(config_from_rows([])).toEqual({});
	});
});
