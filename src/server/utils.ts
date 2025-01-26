import { DB_STRING } from '$env/static/private';
import { Connection } from 'postgresql-client';

export async function connectionContext(func: (connection: Connection) => Promise<any>) {
	let connection = null;
	try {
		// Create connection
		connection = new Connection(DB_STRING);
		// Connect to database server
		await connection.connect();

		return func(connection);
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		if (connection) {
			await connection.close();
		}
	}
}
