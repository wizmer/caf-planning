import { PrismaClient } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ params }) => {
	const gymId = parseInt(params.gymId);

	if (isNaN(gymId)) {
		throw error(400, 'Invalid gym ID');
	}

	try {
		const gym = await prisma.gym.findUnique({
			where: { id: gymId },
			select: {
				id: true,
				name: true,
				description: true
			}
		});

		if (!gym) {
			throw error(404, 'Gym not found');
		}

		const walls = await prisma.wall.findMany({
			where: { gym_id: gymId },
			include: {
				photo: true
			},
			orderBy: {
				created_at: 'desc'
			}
		});

		return {
			gym,
			walls
		};
	} catch (err) {
		if (err instanceof Response) {
			throw err;
		}
		console.error('Error loading walls:', err);
		throw error(500, 'Failed to load walls');
	} finally {
		await prisma.$disconnect();
	}
};

export const actions: Actions = {
	delete: async ({ params, request }) => {
		const data = await request.formData();
		const wallId = parseInt(data.get('wallId') as string);
		const gymId = parseInt(params.gymId);

		if (isNaN(wallId)) {
			return fail(400, { error: 'Invalid wall ID' });
		}

		try {
			// First check if the wall belongs to this gym
			const wall = await prisma.wall.findUnique({
				where: { id: wallId },
				select: { gym_id: true }
			});

			if (!wall) {
				return fail(404, { error: 'Wall not found' });
			}

			if (wall.gym_id !== gymId) {
				return fail(403, { error: 'Wall does not belong to this gym' });
			}

			// Delete the wall (photo will cascade delete if set up in schema)
			await prisma.wall.delete({
				where: { id: wallId }
			});

			return { success: true };
		} catch (err) {
			console.error('Error deleting wall:', err);
			return fail(500, { error: 'Failed to delete wall' });
		} finally {
			await prisma.$disconnect();
		}
	}
};
