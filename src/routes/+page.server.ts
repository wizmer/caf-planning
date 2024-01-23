import type { PageLoad } from './$types';
import {Connection} from 'postgresql-client';
import { DBPASS } from '$env/static/private';


export async function load(){
    // Create connection
    let connection_string = `postgres://postgres:${DBPASS}@127.0.0.1:5432/postgres`
    const connection = new Connection(connection_string);
    // Connect to database server
    await connection.connect();

    // Execute query and fetch rows
    const result = await connection.query(
        ' select * from slots join referents on slots.ref_id = referents.id');



    const rows: any[] = result.rows;
    let slots = {}
    for(let row of rows){
        let day = row[2]
        if(!(day in slots))
            slots[day] = {}
        let user = row[6]
        slots[day][user] = {name: user, start: row[3].toTimeString(), end:row[4].toTimeString()}
    }

    const result2 = await connection.query(' select * from referents');

    // Disconnect from server
    await connection.close();
    return {slots, referents: result2.rows}
}
