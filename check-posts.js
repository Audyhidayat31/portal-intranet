const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const posts = await prisma.employeePost.findMany();
  console.log(`Total DB posts: ${posts.length}`);
}
run();
