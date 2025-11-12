import { PrismaClient } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import type { Actions } from './$types';

const prisma = new PrismaClient();

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const wallName = formData.get('wallName') as string;
		const wallDescription = formData.get('wallDescription') as string;
		const photos = formData.getAll('photos') as File[];
		if (photos.length === 0) {
			return fail(400, { error: 'At least one photo is required' });
		}
		const file = photos[0];

		// Validate input
		if (!wallName?.trim()) {
			return fail(400, { error: 'Wall name is required' });
		}

		if (!photos || photos.length === 0 || photos.some((file) => !file.name)) {
			return fail(400, { error: 'At least one photo is required' });
		}

			const uploadDir = join(process.cwd(), 'static', 'uploads', 'walls');
			await mkdir(uploadDir, { recursive: true });

							const fileExtension = file.name.split('.').pop();
				const fileName = `${randomUUID()}.${fileExtension}`;
				const filePath = join(uploadDir, fileName);

				const buffer = Buffer.from(await file.arrayBuffer());
				await writeFile(filePath, buffer);

		try {
			// Create wall in database
			const wall = await prisma.wall.create({
				data: {
					name: wallName.trim(),
					description: wallDescription?.trim() || null,
					gym_id: parseInt(params.gymId)
					photo: {
						create: {
							file_path: `walls/${fileName}`,
							file_name: file.name,
							mime_type: file.type,
							file_size: file.size
						}
					}
				}
			});


			throw redirect(303, '/pan');
		} catch (error) {
			console.error('Error creating wall:', error);

			// If it's a redirect, re-throw it
			if (error instanceof Response && error.status === 303) {
				throw error;
			}

			return fail(500, { error: 'Failed to create wall. Please try again.' });
		} finally {
			await prisma.$disconnect();
		}
	}
};
