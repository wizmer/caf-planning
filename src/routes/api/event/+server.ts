import { Connection } from 'postgresql-client';
import type { RequestHandler } from './$types';

import { connectionContext } from '../../../server/utils';

export const POST: RequestHandler = async ({ request }) => {
	const { day, type } = await request.json();

	return connectionContext(async (connection: Connection) => {
		await connection.query(`delete from events where day = '${day}'`);
		await connection.query(`insert into events values (DEFAULT, '${day}', '${type}')`);

		return new Response('ok');
	});
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { day } = await request.json();

	return connectionContext(async (connection: Connection) => {
		await connection.query(`delete from events where day = '${day}'`);
		await connection.close();
		return new Response('ok');
	});
};
