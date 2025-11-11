import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
	const { name } = await request.json();

	try {
		await prisma.referents.create({
			data: {
				name: name
			}
		});

		return new Response('ok');
	} catch (error) {
		console.error('Error creating referent:', error);

		// Handle unique constraint violation (duplicate name)
		if (error.code === 'P2002') {
			return new Response('Referent with this name already exists', { status: 400 });
		}

		return new Response('Error creating referent', { status: 500 });
	}
};
