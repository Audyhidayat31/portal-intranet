const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.employeeProfile.findMany();
  for (const profile of profiles) {
    if (profile.unitKerja !== 'Sistem Informasi' && profile.unitKerja !== 'Pusat Data dan Informasi') {
      await prisma.employeeProfile.update({
        where: { id: profile.id },
        data: { unitKerja: 'Pusat Data dan Informasi' }
      });
    }
  }
  console.log('Database updated');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
