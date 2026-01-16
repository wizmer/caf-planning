import { gymSchema } from '$lib/schemas/gym';
import { PrismaClient } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

const prisma = new PrismaClient();

export const load = async () => {
	const form = await superValidate(zod(gymSchema));
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(gymSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { name, description } = form.data;

		try {
			await prisma.gym.create({
				data: {
					name: name.trim(),
					description: description?.trim() || null
				}
			});

			return { form };
		} catch (error) {
			console.error('Error creating gym:', error);
			return fail(500, { form, error: 'An error occurred while creating the gym.' });
		}
	}
};
