import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ params }) => {
	const gym = await prisma.gym.findUniqueOrThrow({
		where: {
			id: parseInt(params.gymId)
		},
		include: {
			walls: {
				include: { photo: true }
			},
			routes: true
		}
	});

	return {
		gym
	};
};
