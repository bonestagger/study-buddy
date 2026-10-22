import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Wiping all demo data from Neon PostgreSQL ---');
  const dNotif = await prisma.notification.deleteMany();
  console.log(`Deleted ${dNotif.count} notifications`);
  const dBook = await prisma.bookmark.deleteMany();
  console.log(`Deleted ${dBook.count} bookmarks`);
  const dKudo = await prisma.kudo.deleteMany();
  console.log(`Deleted ${dKudo.count} kudos`);
  const dAns = await prisma.answer.deleteMany();
  console.log(`Deleted ${dAns.count} answers`);
  const dQues = await prisma.question.deleteMany();
  console.log(`Deleted ${dQues.count} questions`);
  const dReq = await prisma.noteRequest.deleteMany();
  console.log(`Deleted ${dReq.count} note requests`);
  const dNote = await prisma.note.deleteMany();
  console.log(`Deleted ${dNote.count} notes`);
  const dAcc = await prisma.account.deleteMany();
  console.log(`Deleted ${dAcc.count} accounts`);
  const dSess = await prisma.session.deleteMany();
  console.log(`Deleted ${dSess.count} sessions`);
  const dUser = await prisma.user.deleteMany();
  console.log(`Deleted ${dUser.count} users`);
  console.log('✅ Clean slate achieved! All demo data has been wiped.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
