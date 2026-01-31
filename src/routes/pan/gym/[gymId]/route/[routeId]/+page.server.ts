import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const prisma = new PrismaClient();
	const gymId = parseInt(params.gymId);
	const routeId = parseInt(params.routeId);
	if (isNaN(gymId) || isNaN(routeId)) {
		throw error(400, 'Invalid gym or route ID');
	}

	try {
		const route = await prisma.route.findUnique({
			where: { id: routeId }
		});

		if (!route) {
			throw error(404, 'Route not found');
		}
		return { route };
	} catch (err) {
		if (err instanceof Response) {
			throw err;
		}
		console.error('Error loading route:', err);
		throw error(500, 'Failed to load route');
	} finally {
		await prisma.$disconnect();
	}
}
