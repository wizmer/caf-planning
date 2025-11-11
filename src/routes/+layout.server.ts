import { PrismaClient } from '@prisma/client';

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

		return {
			slots,
			events: events_groups,
			referents: referents.map((ref) => [ref.id, ref.name])
		};
	} catch (error) {
		console.error('Error loading data:', error);
		// Return empty data structure on error
		return {
			slots: {},
			events: {},
			referents: []
		};
	}
}
