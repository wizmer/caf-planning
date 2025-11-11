import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	try {
		const walls = await prisma.walls.findMany({
			include: {
				gym: {
					select: {
						id: true,
						name: true
					}
				},
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
			walls
		};
	} catch (error) {
		console.error('Error loading walls:', error);
		return {
			walls: []
		};
	} finally {
		await prisma.$disconnect();
	}
};
