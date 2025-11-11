import { PrismaClient } from '@prisma/client';

import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
	const { day, type } = await request.json();

	try {
		// Delete existing event for this day (if any)
		await prisma.events.deleteMany({
			where: {
				day: day
			}
		});

		// Insert new event
		await prisma.events.create({
			data: {
				day: day,
				type: type
			}
		});

		return new Response('ok');
	} catch (error) {
		console.error('Error updating event:', error);
		return new Response('Error updating event', { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { day } = await request.json();

	try {
		await prisma.events.deleteMany({
			where: {
				day: day
			}
		});

		return new Response('ok');
	} catch (error) {
		console.error('Error deleting event:', error);
		return new Response('Error deleting event', { status: 500 });
	}
};
