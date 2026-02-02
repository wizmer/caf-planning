import { saveRoute } from '$lib/server/actions/route-actions';
import { PrismaClient } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	save: async ({ request, params }) => {
		const formData = await request.formData();
		const gymId = parseInt(params.gymId);
		const routeId = parseInt(params.routeId);

		const result = await saveRoute(formData, gymId, routeId);

		// If there's an error, return it
		if (result && 'status' in result) {
			return result;
		}

		redirect(303, `/pan/gym/${gymId}/route/${routeId}`);
	},

	delete: async ({ params }) => {
		const gymId = parseInt(params.gymId);
		const routeId = parseInt(params.routeId);
		const prisma = new PrismaClient();

		try {
			await prisma.route.delete({
				where: { id: routeId }
			});
		} catch (error) {
			console.error('Error deleting route:', error);
			return fail(500, { error: 'Failed to delete route' });
		} finally {
			await prisma.$disconnect();
		}
		redirect(303, `/pan/gym/${gymId}`);
	}
};
