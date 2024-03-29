import { Connection } from 'postgresql-client';
import { DB_STRING } from '$env/static/private';
import { DateTime } from 'luxon';

export async function load() {
	// Create connection
	const connection = new Connection(DB_STRING);
	// Connect to database server
	await connection.connect();

	// Execute query and fetch rows
	const result = await connection.query(
		'select * from slots join referents on slots.ref_id = referents.id'
	);

	const rows: any[] = result.rows;
	const slots = {};
	for (const row of rows) {
		const day = DateTime.fromISO(row[2].toISOString()).setZone('Europe/Paris');

		if (!(day in slots)) {
			slots[day] = {};
		}
		const user = row[6];
		slots[day][user] = {
			name: user,
			start: row[3].toTimeString().slice(0, 5),
			end: row[4].toTimeString().slice(0, 5)
		};
	}

	const result2 = await connection.query(' select * from referents');

	// Disconnect from server
	await connection.close();
	return { slots, referents: result2.rows };
}
