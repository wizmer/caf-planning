import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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
				wall_photos: {
					orderBy: {
						uploaded_at: 'asc'
					}
				}
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
