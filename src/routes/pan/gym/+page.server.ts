import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	try {
		const gyms = await prisma.gym.findMany({
			include: {
				walls: {
					select: {
						id: true,
						name: true
					}
				}
			},
			orderBy: {
				created_at: 'desc'
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
