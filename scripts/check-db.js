const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const rawTables = await prisma.$queryRawUnsafe('SHOW TABLES');
    const tableKey = Object.keys(rawTables[0])[0];
    const tableNames = rawTables.map(t => t[tableKey]);

    console.log(`\n📊 Total Tables in Database: ${tableNames.length}\n`);
    for (const t of tableNames) {
      const countRes = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM \`${t}\``);
      const count = countRes[0].count;
      console.log(`  📁 ${t.padEnd(28)} : ${count} baris`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
