import { UPLOAD_DIR } from '$env/static/private';
import { PrismaClient } from '@prisma/client';
import { error, fail, redirect } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import type { Actions, PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ params }) => {
	const gymId = parseInt(params.gymId);
	const wallId = parseInt(params.wallId);

	if (isNaN(gymId) || isNaN(wallId)) {
		throw error(400, 'Invalid gym or wall ID');
	}

	try {
		const gym = await prisma.gym.findUnique({
			where: { id: gymId },
			select: {
				id: true,
				name: true
			}
		});

		if (!gym) {
			throw error(404, 'Gym not found');
		}

		const wall = await prisma.wall.findUnique({
			where: { id: wallId },
			include: {
				photo: true
			}
		});

		if (!wall) {
			throw error(404, 'Wall not found');
		}

		if (wall.gym_id !== gymId) {
			throw error(403, 'Wall does not belong to this gym');
		}

		return {
			gym,
			wall
		};
	} catch (err) {
		if (err instanceof Response) {
			throw err;
		}
		console.error('Error loading wall:', err);
		throw error(500, 'Failed to load wall');
	} finally {
		await prisma.$disconnect();
	}
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const wallName = formData.get('wallName') as string;
		const wallDescription = formData.get('wallDescription') as string;
		const photos = formData.getAll('photos') as File[];

		const gymId = parseInt(params.gymId);
		const wallId = parseInt(params.wallId);

		// Validate input
		if (!wallName?.trim()) {
			return fail(400, { error: 'Wall name is required' });
		}

		try {
			if (isNaN(gymId) || isNaN(wallId)) {
				return fail(400, { error: 'Invalid gym or wall ID' });
			}

			// Check if wall exists and belongs to this gym
			const existingWall = await prisma.wall.findUnique({
				where: { id: wallId },
				select: { gym_id: true, photo_id: true }
			});

			if (!existingWall) {
				return fail(404, { error: 'Wall not found' });
			}

			if (existingWall.gym_id !== gymId) {
				return fail(403, { error: 'Wall does not belong to this gym' });
			}

			// Handle photo update if new photo is provided
			let photoId = existingWall.photo_id;

			if (photos && photos.length > 0 && photos[0].name) {
				const file = photos[0];

				const uploadDir = join(UPLOAD_DIR, 'walls');
				await mkdir(uploadDir, { recursive: true });

				const fileExtension = file.name.split('.').pop();
				const fileName = `${randomUUID()}.${fileExtension}`;
				const filePath = join(uploadDir, fileName);

				const buffer = Buffer.from(await file.arrayBuffer());
				await writeFile(filePath, buffer);

				// Create new photo
				const photo = await prisma.photo.create({
					data: {
						file_path: `walls/${fileName}`,
						file_name: file.name,
						mime_type: file.type,
						file_size: file.size
					}
				});

				photoId = photo.id;

				// Optionally: Delete old photo if needed
			}

			// Update wall
			await prisma.wall.update({
				where: { id: wallId },
				data: {
					name: wallName.trim(),
					description: wallDescription?.trim() || null,
					photo_id: photoId
				}
			});
		} catch (err) {
			console.error('Error updating wall:', err);

			if (err instanceof Response && err.status === 303) {
				throw err;
			}

			return fail(500, { error: 'Failed to update wall' });
		} finally {
			await prisma.$disconnect();
		}

		throw redirect(303, `/pan/gym/${gymId}/walls`);
	}
};
