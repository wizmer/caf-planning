import type { RequestHandler } from './$types';
import { Connection } from 'postgresql-client';

import { DB_STRING } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	let { name } = await request.json();

	const connection = new Connection(DB_STRING);
	// Connect to database server
	await connection.connect();

	let q = `INSERT INTO referents(name) VALUES ('${name}')`;
	console.log('q');
	console.log(q);
	// Execute query and fetch rows
	let res = await connection.query(q);
	console.log(res);

	// Disconnect from server
	await connection.close();

	return new Response('ok');
};
