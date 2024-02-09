import type { RequestHandler } from './$types';
import { Connection } from 'postgresql-client';

import { DB_STRING } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const { name } = await request.json();

	const connection = new Connection(DB_STRING);
	// Connect to database server
	await connection.connect();

	const q = `INSERT INTO referents(name) VALUES ('${name}')`;
	// Execute query and fetch rows
	await connection.query(q);

	// Disconnect from server
	await connection.close();

	return new Response('ok');
};
