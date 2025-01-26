import { Connection } from 'postgresql-client';
import type { RequestHandler } from './$types';

import { connectionContext } from '../../../server/utils';

export const POST: RequestHandler = async ({ request }) => {
	const { day, ref } = await request.json();
	return connectionContext(async (connection: Connection) => {
		if (ref.start && ref.end) {
			const name = await connection.query(`select id from referents where  name = '${ref.name}'`);
			const ref_id = name.rows[0][0];
			await connection.query(`delete from slots where ref_id = ${ref_id} and day = '${day}'`);
			await connection.query(
				`insert into slots values (DEFAULT, ${ref_id}, '${day}', '${ref.start}', '${ref.end}')`
			);

			return new Response('ok');
		} else if (!ref.start && !ref.end) {
			const name = await connection.query(`select id from referents where  name = '${ref.name}'`);
			const ref_id = name.rows[0][0];
			await connection.query(`delete from slots where ref_id = ${ref_id} and day = '${day}'`);

			return new Response('ok');
		}

		return new Response('error');
	});
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { ref_id } = await request.json();

	return connectionContext(async (connection: Connection) => {
		await connection.query(`delete from slots where ref_id = ${ref_id}`);
		await connection.query(`delete from referents where id = ${ref_id}`);
		return new Response('ok');
	});
};
