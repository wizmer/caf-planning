import { PrismaClient } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
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
			include: {
				walls: {
					include: {
						photo: true
					},
					orderBy: {
						created_at: 'asc'
					}
				}
			}
		});

		if (!gym) {
			throw error(404, 'Gym not found');
		}

		return { gym };
	} finally {
		await prisma.$disconnect();
	}
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const grade = formData.get('grade') as string;
		const description = formData.get('routeDescription') as string;
		const bodyString = formData.get('body') as string;

		// Validate input
		if (!name?.trim()) {
			return fail(400, { error: 'Route name is required' });
		}

		if (!grade?.trim()) {
			return fail(400, { error: 'Route grade is required' });
		}

		// Parse and validate route moves
		let routeMoves;
		try {
			routeMoves = JSON.parse(bodyString || '[]');
		} catch (error) {
			return fail(400, { error: 'Invalid route data' });
		}

		if (!Array.isArray(routeMoves) || routeMoves.length === 0) {
			return fail(400, { error: 'At least one move is required' });
		}

		// Validate gym exists
		const gymId = parseInt(params.gymId);
		if (isNaN(gymId)) {
			return fail(400, { error: 'Invalid gym ID' });
		}

		try {
			const gym = await prisma.gym.findUnique({
				where: { id: gymId }
			});

			if (!gym) {
				return fail(404, { error: 'Gym not found' });
			}

			// Create route in database
			const route = await prisma.route.create({
				data: {
					name: name.trim(),
					grade: grade.trim(),
					description: description?.trim() || null,
					body: routeMoves,
					gymId: gymId
				}
			});
		} catch (error) {
			console.error('Error creating route:', error);

			// If it's a redirect, re-throw it
			if (error instanceof Response && error.status === 303) {
				throw error;
			}

			return fail(500, { error: 'Failed to create route. Please try again.' });
		} finally {
			await prisma.$disconnect();
		}
		redirect(303, `/pan/gym/${gymId}`);
	}
};
