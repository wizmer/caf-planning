import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
	await prisma.referents.createMany({
		data: [{ name: 'Alice' }, { name: 'Bob' }]
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
				gymId: 0,
				body: [
					{
						x: 16.86643835616438,
						y: 40.43949771689498,
						id: '17d8c7fa-cfb4-43ed-90a8-20428c1c7d00',
						type: 'finish',
						index: 0,
						radius: 16,
						wallId: 1
					},
					{
						x: 57.61986301369863,
						y: 42.83675799086758,
						id: '5208827e-b716-449f-bbae-f24636c20b03',
						type: 'finish',
						index: 1,
						radius: 16,
						wallId: 1
					},
					{
						x: 71.4041095890411,
						y: 34.16095890410959,
						id: 'f2476d0d-3eca-497a-8ea5-a9275e3bc135',
						type: 'finish',
						index: 2,
						radius: 16,
						wallId: 1
					},
					{
						x: 34.41780821917808,
						y: 74.57191780821918,
						id: 'e80fd826-f6ef-41fc-b304-a3fcca16f390',
						type: 'finish',
						index: 3,
						radius: 16,
						wallId: 1
					},
					{
						x: 73.03082191780823,
						y: 84.96004566210046,
						id: 'd13705eb-54e9-41b5-8202-ec9b44843d13',
						type: 'finish',
						index: 4,
						radius: 16,
						wallId: 1
					}
				]
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
