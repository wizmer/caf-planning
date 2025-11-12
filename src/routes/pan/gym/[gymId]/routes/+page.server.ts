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
			include: {
				walls: {
					include: {
						photo: true
					}
				},
				routes: true
			}
		});

		console.log('gym', gym);
		if (!gym) {
			throw error(404, 'Gym not found');
		}

		return {
			gym
		};
	} finally {
		await prisma.$disconnect();
	}
};
