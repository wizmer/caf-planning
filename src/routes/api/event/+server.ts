import { Connection } from 'postgresql-client';
import type { RequestHandler } from './$types';

import { DB_STRING } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const { day, type } = await request.json();

	const connection = new Connection(DB_STRING);
	// Connect to database server
	await connection.connect();

	// Execute query and fetch rows
	await connection.query(`delete from events where day = '${day}'`);
	await connection.query(`insert into events values (DEFAULT, '${day}', '${type}')`);

	// Disconnect from server
	await connection.close();

	return new Response('ok');
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { day } = await request.json();

	const connection = new Connection(DB_STRING);
	await connection.connect();
	await connection.query(`delete from events where day = '${day}'`);
	await connection.close();
	return new Response('ok');
};
