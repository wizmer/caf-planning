import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ params }) => {
	try {
		const gyms = await prisma.gym.findUniqueOrThrow({
			where: {
				id: parseInt(params.gymId)
			},
			include: {
				walls: {
					select: {
						id: true,
						name: true
					}
				}
			}
		});

		return {
			gyms
		};
	} catch (error) {
		console.error('Error loading gyms:', error);
		return {
			gyms: []
		};
	} finally {
		await prisma.$disconnect();
	}
};
