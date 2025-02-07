import { Connection } from 'postgresql-client';
import type { RequestHandler } from './$types';

import { connectionContext } from '../../../server/utils';

export const POST: RequestHandler = async ({ request }) => {
	const { name } = await request.json();

	return connectionContext(async (connection: Connection) => {
		const q = `INSERT INTO referents(name) VALUES ('${name}')`;
		// Execute query and fetch rows
		await connection.query(q);

		return new Response('ok');
	});
};
