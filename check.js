const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const users = await prisma.user.findMany({ include: { profile: true }});
  console.log(users.map(u => ({ name: u.name, position: u.profile.position, unitKerja: u.profile.unitKerja })));
}
run();
