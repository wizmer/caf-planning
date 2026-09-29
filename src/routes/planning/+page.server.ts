import { PrismaClient } from '@prisma/client';

export async function load() {
	// Transform slots data to match your existing structure
	// Get current date minus 1 day for filtering
	const prisma = new PrismaClient();
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
	const slots = {};
	for (const slot of slotsWithReferents) {
		const day = slot.day;
		if (!(day in slots)) {
			slots[day] = {};
		}

		if (slot.referents) {
			const user = slot.referents.name;
			const formatUTCTime = (date: Date) =>
				`${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;

			slots[day][user] = {
				name: user,
				start: formatUTCTime(slot.start_at),
				end: formatUTCTime(slot.end_at)
			};
		}
	}

	return { slots };
}
