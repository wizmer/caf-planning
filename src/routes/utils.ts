import { DateTime } from 'luxon';

export function create_slots() {
    const slots = {};

    const today = DateTime.now().setZone('utc+0', { keepLocalTime: true }).startOf('day');

    for (let i = 0; i < 20; i++) {
        const day = today.plus({ days: i });

        let item = {
            id: i,
            day: day,
            month: day.month,
            date: day.toLocaleString({ weekday: 'long', day: 'numeric', month: 'long' }),
            status: 'ok',
            adding_slot: false,
            refs: {}
        };

        // let cancelled_day = new Date(2024, 0, 19);
        // if (day.toDateString() == cancelled_day.toDateString()) {
        //     item.status = "cancelled";
        // }

        slots[day] = item;
    }
    return slots
}
