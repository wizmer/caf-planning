import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
	const { day, ref } = await request.json();

	try {
		// Find the referent by name
		const referent = await prisma.referents.findUnique({
			where: {
				name: ref.name
			}
		});

		if (!referent) {
			return new Response('Referent not found', { status: 404 });
		}

		if (ref.start && ref.end) {
			// Delete existing slot for this referent and day
			await prisma.slots.deleteMany({
				where: {
					ref_id: referent.id,
					day: day
				}
			});

			// Create new slot
			await prisma.slots.create({
				data: {
					ref_id: referent.id,
					day: day,
					start_at: new Date(`1970-01-01T${ref.start}:00Z`),
					end_at: new Date(`1970-01-01T${ref.end}:00Z`)
				}
			});

			return new Response('ok');
		} else if (!ref.start && !ref.end) {
			// Delete existing slot for this referent and day
			await prisma.slots.deleteMany({
				where: {
					ref_id: referent.id,
					day: day
				}
			});

			return new Response('ok');
		}

		return new Response('Invalid slot data', { status: 400 });
	} catch (error) {
		console.error('Error updating slot:', error);
		return new Response('Error updating slot', { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { ref_id } = await request.json();

	try {
		// Delete all slots for this referent first (due to foreign key constraint)
		await prisma.slots.deleteMany({
			where: {
				ref_id: ref_id
			}
		});

		// Delete the referent
		await prisma.referents.delete({
			where: {
				id: ref_id
			}
		});

		return new Response('ok');
	} catch (error) {
		console.error('Error deleting referent and slots:', error);

		// Handle case where referent doesn't exist
		if (error.code === 'P2025') {
			return new Response('Referent not found', { status: 404 });
		}

		return new Response('Error deleting referent and slots', { status: 500 });
	}
};
