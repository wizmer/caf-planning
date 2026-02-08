import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
	await prisma.referents.createMany({
		data: [Array.from({ length: 30 }, (_, i) => ({ id: i, name: `referent${i + 1}` }))].flat()
	});

	await prisma.gym.createMany({
		data: [
			{ id: 0, name: 'Gym A' },
			{ id: 1, name: 'Gym B' },
			{ id: 2, name: 'Gym C' }
		]
	});

	await prisma.photo.createMany({
		data: [
			{
				id: 0,
				file_path: 'walls/sample.jpeg',
				file_name: 'sample.jpeg',
				mime_type: 'image/jpeg',
				file_size: 123456
			},
			{
				id: 1,
				file_path: 'walls/sample2.jpeg',
				file_name: 'sample2.jpeg',
				mime_type: 'image/jpeg',
				file_size: 123456
			}
		]
	});
	await prisma.wall.createMany({
		data: [
			{
				id: 0,
				name: 'Mur 1',
				gym_id: 2,
				photo_id: 0,
				created_at: new Date('2026-02-01T10:47:45.371Z'),
				updated_at: new Date('2026-02-01T10:47:45.371Z')
			},
			{
				id: 1,
				name: 'Mur 2',
				gym_id: 2,
				photo_id: 1,
				created_at: new Date('2026-02-02T10:47:45.381Z'),
				updated_at: new Date('2026-02-02T10:47:45.381Z')
			}
		]
	});

	for (let i = 0; i < 10; i++) {
		await prisma.route.create({
			data: {
				name: `Route ${i + 1}`,
				grade: ['4c', '5a', '5b', '6a', '6b', '7a', '7b', '8a', '8b', '9a'][i % 10],
				gymId: 2,
				moves: {
					create: [
						{ x: 10, y: 20, type: 'foot', radius: 5, wallId: 0 },
						{ x: 30, y: 40, type: 'hand', radius: 5, wallId: 0 }
					]
				}
			},
			include: {
				moves: true
			}
		});
	}
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
	});
