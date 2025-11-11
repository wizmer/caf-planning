import { PrismaClient } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

const prisma = new PrismaClient();

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const gymName = formData.get('gymName') as string;
		const gymDescription = formData.get('gymDescription') as string;

		// Validate input
		if (!gymName?.trim()) {
			return fail(400, { error: 'Gym name is required' });
		}

		try {
			await prisma.gym.create({
				data: {
					name: gymName.trim(),
					description: gymDescription?.trim() || null
				}
			});

			return { success: true };
		} catch (error) {
			console.error('Error creating gym:', error);

			// If it's a redirect, re-throw it
			if (error instanceof Response && error.status === 303) {
				throw error;
			}

			return fail(500, { error: 'Failed to create gym. Please try again.' });
		} finally {
			await prisma.$disconnect();
		}
	}
};
