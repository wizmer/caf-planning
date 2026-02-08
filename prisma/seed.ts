import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
	await prisma.referents.createMany({
		data: [Array.from({ length: 30 }, (_, i) => ({ id: i, name: `referent${i + 1}` }))].flat()
	});

	await prisma.gym.createMany({
		data: [
			{ id: 0, name: 'Gym A' },
			{ id: 1, name: 'Gym B' }
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
				gym_id: 0,
				photo_id: 0,
				created_at: new Date('2026-02-01T10:47:45.371Z'),
				updated_at: new Date('2026-02-01T10:47:45.371Z')
			},
			{
				id: 1,
				name: 'Mur 2',
				gym_id: 0,
				photo_id: 1,
				created_at: new Date('2026-02-02T10:47:45.381Z'),
				updated_at: new Date('2026-02-02T10:47:45.381Z')
			}
		]
	});

	//   1 | aoeuaoe | 7c+   | aoeu        | 2026-02-02 10:47:45.371 | 2026-02-02 10:47:45.371 |     0 | [{"x": 33.13356164383562, "y": 37.64447675614875, "id": "be5421dc-7bb9-45a6-9d4d-bfa0f6c6f8f3", "type": "hand", "index": 0, "radius": 16, "wallId": 1}, {"x": 63.4417808219178, "y": 42.8456752503885, "id": "ef03a9d6-9f8b-4334-b83f-64c63bed3375", "type": "hand", "index": 1, "radius": 16, "wallId": 1}, {"x": 44.26369863013699, "y": 57.42187349967764, "id": "6b08ff32-6fd7-4305-a0b9-832812e6966d", "type": "hand", "index": 2, "radius": 16, "wallId": 1}]
	await prisma.route.createMany({
		data: [
			{
				name: 'Route 1',
				grade: '5a',
				gymId: 0
			}
		]
	});
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
