import { saveRoute } from '$lib/server/actions/route-actions';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	save: async ({ request, params }) => {
		const formData = await request.formData();
		const gymId = parseInt(params.gymId);

		const result = await saveRoute(formData, gymId);

		// If there's an error, return it
		if (result && 'status' in result) {
			return result;
		}

		// Success - redirect to gym page
		redirect(303, `/pan/gym/${gymId}`);
	}
};
