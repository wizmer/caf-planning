import { Connection } from 'postgresql-client';
import { connectionContext } from '../server/utils';

export async function load() {
	return connectionContext(async (connection: Connection) => {
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
		const events = await connection.query(`select * from events where date(day) >= (now() - INTERVAL '1 day')`);

		const events_groups = Object.fromEntries(events.rows.map((row) => [row[1], row]));
		return { slots, events: events_groups, referents: referents.rows };
	});
}
