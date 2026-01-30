import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
	await prisma.referents.createMany({
		data: [{ name: 'Alice' }, { name: 'Bob' }]
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
