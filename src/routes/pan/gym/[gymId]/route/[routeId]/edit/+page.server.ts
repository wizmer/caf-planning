import { saveRoute } from '$lib/server/actions/route-actions';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const gymId = parseInt(params.gymId);
		const routeId = parseInt(params.routeId);

		const result = await saveRoute(formData, gymId, routeId);

		// If there's an error, return it
		if (result && 'status' in result) {
			return result;
		}

		redirect(303, `/pan/gym/${gymId}/route/${routeId}`);
	}
};
