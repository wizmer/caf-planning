import type { RequestHandler } from './$types';
import {Connection} from 'postgresql-client';

import { DB_STRING } from '$env/static/private';

//76&*CNjouel)(
export const POST: RequestHandler = async ({request}) => {
    let {day, ref} = await request.json();

    if(ref.start && ref.end){
        const connection = new Connection(DB_STRING);
        // Connect to database server
        await connection.connect();

        // Execute query and fetch rows
        let name = await connection.query(`select id from referents where  name = '${ref.name}'`)
        let ref_id = name.rows[0][0]
        let del = await connection.query(`delete from slots where ref_id = ${ref_id} and day = '${day}'`)
        console.log(del)
        let insert = await connection.query(`insert into slots values (DEFAULT, ${ref_id}, '${day}', '${ref.start}', '${ref.end}')`)
        console.log(insert)



        // Disconnect from server
        await connection.close();

        return new Response('ok')

    }
    return new Response('error')


};
