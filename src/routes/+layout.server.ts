import { PrismaClient } from '@prisma/client';

import { config_from_rows } from './utils';

const prisma = new PrismaClient();

export async function load() {
	try {
		// Get current date minus 1 day for filtering
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const yesterdayStr = yesterday.toISOString().split('T')[0];

		// Get slots with referent data for dates >= yesterday
		const slotsWithReferents = await prisma.slots.findMany({
			where: {
				day: {
					gte: yesterdayStr
				}
			},
			include: {
				referents: true
			}
		});

		// Transform slots data to match your existing structure
		const slots = {};
		for (const slot of slotsWithReferents) {
			const day = slot.day;
			if (!(day in slots)) {
				slots[day] = {};
			}

			if (slot.referents) {
				const user = slot.referents.name;
				slots[day][user] = {
					name: user,
					start: slot.start_at.toTimeString().slice(0, 5),
					end: slot.end_at.toTimeString().slice(0, 5)
				};
			}
		}

		// Get all referents
		const referents = await prisma.referents.findMany();

		// Get events for dates >= yesterday
		const events = await prisma.events.findMany({
			where: {
				day: {
					gte: yesterdayStr
				}
			}
		});

		// Transform events to match your existing structure
		const events_groups = Object.fromEntries(
			events.map((event) => [event.day, [event.id, event.day, event.type]])
		);

		// Get recurring days config (falls back to defaults if table is empty)
		const recurring_rows = await prisma.recurring_days.findMany({ orderBy: { weekday: 'asc' } });

		return {
			slots,
			events: events_groups,
			referents: referents.map((ref) => [ref.id, ref.name]),
			recurring: config_from_rows(recurring_rows)
		};
	} catch (error) {
		console.error('Error loading data:', error);
		// Return empty data structure on error
		return {
			slots: {},
			events: {},
			referents: [],
			recurring: config_from_rows([])
		};
	}
}
