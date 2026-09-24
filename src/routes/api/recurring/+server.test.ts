import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
	deleteMany: vi.fn(),
	createMany: vi.fn(),
	transaction: vi.fn()
}));

vi.mock('@prisma/client', () => ({
	PrismaClient: class {
		recurring_days = { deleteMany: mocks.deleteMany, createMany: mocks.createMany };
		$transaction = mocks.transaction;
	}
}));

import { POST } from './+server';

const valid_rows = [
	{ weekday: 1, start: 18, end: 22, active: true },
	{ weekday: 2, start: 18, end: 22, active: true },
	{ weekday: 3, start: 20, end: 22, active: true },
	{ weekday: 4, start: 18, end: 22, active: false },
	{ weekday: 5, start: 18, end: 22, active: true },
	{ weekday: 6, start: 9, end: 13, active: true },
	{ weekday: 7, start: 18, end: 22, active: false }
];

function post(body: unknown) {
	return POST({
		request: new Request('http://localhost/api/recurring', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body)
		})
	} as any);
}

describe('POST /api/recurring', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('remplace la config en transaction si valide', async () => {
		const response = await post(valid_rows);

		expect(response.status).toBe(200);
		expect(await response.text()).toBe('ok');
		expect(mocks.transaction).toHaveBeenCalledTimes(1);
		expect(mocks.deleteMany).toHaveBeenCalledTimes(1);
		expect(mocks.createMany).toHaveBeenCalledWith({ data: valid_rows });
	});

	it('refuse un weekday hors 1-7', async () => {
		const response = await post([{ weekday: 8, start: 18, end: 22, active: true }]);

		expect(response.status).toBe(400);
		expect(mocks.transaction).not.toHaveBeenCalled();
	});

	it('refuse start >= end', async () => {
		const response = await post([{ weekday: 1, start: 22, end: 18, active: true }]);

		expect(response.status).toBe(400);
		expect(mocks.transaction).not.toHaveBeenCalled();
	});

	it('refuse des heures non entières', async () => {
		const response = await post([{ weekday: 1, start: 9.5, end: 13, active: true }]);

		expect(response.status).toBe(400);
		expect(mocks.transaction).not.toHaveBeenCalled();
	});

	it('refuse un flag active non booléen', async () => {
		const response = await post([{ weekday: 1, start: 18, end: 22, active: 'true' }]);

		expect(response.status).toBe(400);
		expect(mocks.transaction).not.toHaveBeenCalled();
	});

	it('refuse des weekdays dupliqués', async () => {
		const response = await post([
			{ weekday: 1, start: 18, end: 22, active: true },
			{ weekday: 1, start: 10, end: 12, active: true }
		]);

		expect(response.status).toBe(400);
		expect(mocks.transaction).not.toHaveBeenCalled();
	});

	it('refuse un body vide ou non tableau', async () => {
		expect((await post([])).status).toBe(400);
		expect((await post({ weekday: 1 })).status).toBe(400);
		expect(mocks.transaction).not.toHaveBeenCalled();
	});
});
