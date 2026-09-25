import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

function valid_config(body) {
	if (!Array.isArray(body) || body.length === 0) {
		return false;
	}
	const weekdays = new Set();
	for (const row of body) {
		if (
			!Number.isInteger(row.weekday) ||
			row.weekday < 1 ||
			row.weekday > 7 ||
			!Number.isInteger(row.start) ||
			!Number.isInteger(row.end) ||
			row.start < 0 ||
			row.end > 24 ||
			row.start >= row.end ||
			typeof row.active !== 'boolean'
		) {
			return false;
		}
		if (weekdays.has(row.weekday)) {
			return false;
		}
		weekdays.add(row.weekday);
	}
	return true;
}

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	if (!valid_config(body)) {
		return new Response('Invalid recurring config', { status: 400 });
	}

	try {
		await prisma.$transaction([
			prisma.recurring_days.deleteMany(),
			prisma.recurring_days.createMany({
				data: body.map((row) => ({
					weekday: row.weekday,
					start: row.start,
					end: row.end,
					active: row.active
				}))
			})
		]);

		return new Response('ok');
	} catch (error) {
		console.error('Error updating recurring config:', error);
		return new Response('Error updating recurring config', { status: 500 });
	}
};
