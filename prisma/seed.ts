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
			}
		]
	});
	await prisma.wall.createMany({
		data: [
			{
				name: 'Mur 1',
				gym_id: 0,
				photo_id: 0
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
