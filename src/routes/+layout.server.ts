import { DB_STRING } from '$env/static/private';
import { Connection } from 'postgresql-client';

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
		const day = row[2];
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

	const referents = await connection.query('select * from referents');
	const events = await connection.query('select * from events');

	const events_groups = Object.fromEntries(events.rows.map((row) => [row[1], row]));

	await connection.close();
	return { slots, events: events_groups, referents: referents.rows };
}
