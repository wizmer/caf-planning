import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './edit/$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ params }) => {
	const route = await prisma.route.findUniqueOrThrow({
		where: {
			id: parseInt(params.routeId)
		}
	});

	return {
		route
	};
};
