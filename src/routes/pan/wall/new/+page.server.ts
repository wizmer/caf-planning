import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const wallName = formData.get('wallName') as string;
		const wallDescription = formData.get('wallDescription') as string;
		const photos = formData.getAll('photos') as File[];

		// Validate input
		if (!wallName?.trim()) {
			return fail(400, { error: 'Wall name is required' });
		}

		if (!photos || photos.length === 0 || photos.some((file) => !file.name)) {
			return fail(400, { error: 'At least one photo is required' });
		}

		try {
			// Create wall in database
			const wall = await prisma.walls.create({
				data: {
					name: wallName.trim(),
					description: wallDescription?.trim() || null
				}
			});

			// Process and save photos
			const uploadDir = join(process.cwd(), 'static', 'uploads', 'walls');
			await mkdir(uploadDir, { recursive: true });

			const photoPromises = photos.map(async (file) => {
				const fileExtension = file.name.split('.').pop();
				const fileName = `${randomUUID()}.${fileExtension}`;
				const filePath = join(uploadDir, fileName);

				const buffer = Buffer.from(await file.arrayBuffer());
				await writeFile(filePath, buffer);

				return prisma.wall_photos.create({
					data: {
						wall_id: wall.id,
						file_path: `walls/${fileName}`,
						file_name: file.name,
						mime_type: file.type,
						file_size: file.size
					}
				});
			});

			await Promise.all(photoPromises);

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
