import type { RequestHandler } from './$types';
import { Connection } from 'postgresql-client';

import { DB_STRING } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const { day, ref } = await request.json();

	if (ref.start && ref.end) {
		const connection = new Connection(DB_STRING);
		// Connect to database server
		await connection.connect();

		// Execute query and fetch rows
		const name = await connection.query(`select id from referents where  name = '${ref.name}'`);
		const ref_id = name.rows[0][0];
		await connection.query(`delete from slots where ref_id = ${ref_id} and day = '${day}'`);
		await connection.query(
			`insert into slots values (DEFAULT, ${ref_id}, '${day}', '${ref.start}', '${ref.end}')`
		);

		// Disconnect from server
		await connection.close();

		return new Response('ok');
	} else if (!ref.start && !ref.end) {
		const connection = new Connection(DB_STRING);
		// Connect to database server
		await connection.connect();

		// Execute query and fetch rows
		const name = await connection.query(`select id from referents where  name = '${ref.name}'`);
		const ref_id = name.rows[0][0];
		await connection.query(`delete from slots where ref_id = ${ref_id} and day = '${day}'`);

		// Disconnect from server
		await connection.close();

		return new Response('ok');
	}

	return new Response('error');
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { ref_id } = await request.json();

	const connection = new Connection(DB_STRING);
	await connection.connect();
	console.log('ref_id');
	console.log(ref_id);
	await connection.query(`delete from slots where ref_id = ${ref_id}`);
	await connection.query(`delete from referents where id = ${ref_id}`);
	await connection.close();
	return new Response('ok');
};
