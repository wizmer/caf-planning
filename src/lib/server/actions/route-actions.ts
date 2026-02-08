import type { Move } from '@lucide/svelte';
import { PrismaClient } from '@prisma/client';
import { fail } from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function saveRoute(formData: FormData, gymId: number, routeId?: number) {
	const name = formData.get('name') as string;
	const grade = formData.get('grade') as string;
	const description = formData.get('description') as string;
	const movesString = formData.get('moves') as string;

	// Validate input
	if (!name?.trim()) {
		return fail(400, { error: 'Route name is required' });
	}

	if (!grade?.trim()) {
		return fail(400, { error: 'Route grade is required' });
	}

	// Parse and validate route moves
	let moves: Move[];
	try {
		moves = JSON.parse(movesString || '[]');
	} catch (error) {
		return fail(400, { error: 'Invalid route data' });
	}

	if (!Array.isArray(moves) || moves.length === 0) {
		return fail(400, { error: 'At least one move is required' });
	}

	// Validate gym exists
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

		const routeData = {
			name: name.trim(),
			grade: grade.trim(),
			description: description?.trim() || null,
			gymId: gymId
		};

		// Update existing route or create new one
		if (routeId) {
			// Validate route exists and belongs to this gym
			const existingRoute = await prisma.route.findUnique({
				where: { id: routeId }
			});

			if (!existingRoute) {
				return fail(404, { error: 'Route not found' });
			}

			if (existingRoute.gymId !== gymId) {
				return fail(403, { error: 'Route does not belong to this gym' });
			}

			moves.forEach((move) => {
				delete move.routeId;
			});
			await prisma.route.update({
				where: { id: routeId },
				data: {
					...routeData,
					moves: {
						deleteMany: {},
						create: moves
					}
				},
				include: { moves: true }
			});
		} else {
			// Create new route
			const route = await prisma.route.create({
				data: routeData
			});
			await prisma.move.createMany({
				data: moves.map((move) => ({
					...move,
					routeId: route.id
				}))
			});
		}

		return { success: true };
	} catch (error) {
		console.error('Error saving route:', error);

		// If it's a redirect, re-throw it
		if (error instanceof Response && error.status === 303) {
			throw error;
		}

		return fail(500, { error: 'Failed to save route. Please try again.' });
	} finally {
		await prisma.$disconnect();
	}
}
