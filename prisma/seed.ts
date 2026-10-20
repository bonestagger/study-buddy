import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.notification.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.kudo.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.noteRequest.deleteMany();
  await prisma.note.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding classmates...');
  // 1. Aarav Patel (Default logged-in student)
  const aarav = await prisma.user.create({
    data: {
      name: 'Aarav Patel',
      email: 'aarav.patel@gmail.com',
      pfpType: 'emoji',
      pfpValue: '🦉',
      division: '8-B',
      rollNumber: '14',
      motto: 'Prepping for Math UT2 📚',
      xp: 380,
      rankTitle: 'Silver',
      palette: 'palette-midnight',
      themeMode: 'dark',
    },
  });

  // 2. Priya Sharma
  const priya = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya.s@student.school.edu',
      pfpType: 'emoji',
      pfpValue: '🦊',
      division: '8-B',
      rollNumber: '28',
      motto: 'Chemistry is fun! 🧪',
      xp: 720,
      rankTitle: 'Silver',
      palette: 'palette-midnight',
      themeMode: 'dark',
    },
  });

  // 3. Rohan Kumar
  const rohan = await prisma.user.create({
    data: {
      name: 'Rohan Kumar',
      email: 'rohan.k@student.school.edu',
      pfpType: 'emoji',
      pfpValue: '🚀',
      division: '8-A',
      rollNumber: '05',
      motto: 'Math enthusiast 📐',
      xp: 1450,
      rankTitle: 'Gold',
      palette: 'palette-midnight',
      themeMode: 'dark',
    },
  });

  // 4. Ananya Mishra
  const ananya = await prisma.user.create({
    data: {
      name: 'Ananya Mishra',
      email: 'ananya.m@student.school.edu',
      pfpType: 'emoji',
      pfpValue: '⚡',
      division: '8-C',
      rollNumber: '12',
      motto: 'Hindi literature lover 📖',
      xp: 890,
      rankTitle: 'Silver',
      palette: 'palette-midnight',
      themeMode: 'dark',
    },
  });

  // 5. Varun Kapoor
  const varun = await prisma.user.create({
    data: {
      name: 'Varun Kapoor',
      email: 'varun.k@student.school.edu',
      pfpType: 'emoji',
      pfpValue: '🏛️',
      division: '8-B',
      rollNumber: '32',
      motto: 'History & Civics ace 📜',
      xp: 1120,
      rankTitle: 'Gold',
      palette: 'palette-midnight',
      themeMode: 'dark',
    },
  });

  console.log('Seeding notes & worksheets...');
  // Note 1: Math Factorisation (Homework due tomorrow)
  const mathNote = await prisma.note.create({
    data: {
      title: 'Factorisation Ex 7.2 (Problems #1 to #8)',
      subject: 'MATH',
      type: 'HW',
      isHomework: true,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      dueDay: 'Tomorrow',
      dueTime: '8:00 AM (Morning)',
      fileUrl: '/sheets/math-factorisation.json',
      pageCount: 3,
      kudosCount: 8,
      userId: rohan.id,
    },
  });

  // Note 2: Chem Valency (Solved notes)
  const chemNote = await prisma.note.create({
    data: {
      title: 'Language of Chemistry: Valency & 15 Balanced Equations',
      subject: 'CHEM',
      type: 'SOLVED',
      isHomework: false,
      fileUrl: '/sheets/chem-valency.json',
      pageCount: 2,
      kudosCount: 15,
      userId: priya.id,
    },
  });

  // Note 3: Hindi Vyakaran (Practice set)
  const hindiNote = await prisma.note.create({
    data: {
      title: 'व्याकरण: स्वर संधि के 5 भेद व 20 अभ्यास प्रश्न',
      subject: 'HINDI',
      type: 'BLANK',
      isHomework: false,
      fileUrl: '/sheets/hindi-sandhi.json',
      pageCount: 2,
      kudosCount: 6,
      userId: ananya.id,
    },
  });

  // Note 4: History 1857 Revolt (Solved notes)
  const histNote = await prisma.note.create({
    data: {
      title: 'The Great Uprising of 1857: Timeline & Important Q&A',
      subject: 'HIST',
      type: 'SOLVED',
      isHomework: false,
      fileUrl: '/sheets/hist-1857.json',
      pageCount: 4,
      kudosCount: 12,
      userId: varun.id,
    },
  });

  // Note 5: Physics (Force and Pressure)
  const physNote = await prisma.note.create({
    data: {
      title: 'Force and Pressure: Numericals & Atmospheric Pressure Laws',
      subject: 'PHYS',
      type: 'HW',
      isHomework: true,
      dueDay: 'Tomorrow',
      dueTime: '9:00 AM (Morning)',
      fileUrl: '/sheets/math-factorisation.json',
      pageCount: 3,
      kudosCount: 14,
      userId: rohan.id,
    },
  });

  // Note 6: Biology (Transport in Plants)
  const bioNote = await prisma.note.create({
    data: {
      title: 'Transport in Plants: Xylem, Phloem & Transpiration Cycle',
      subject: 'BIO',
      type: 'SOLVED',
      isHomework: false,
      fileUrl: '/sheets/chem-valency.json',
      pageCount: 3,
      kudosCount: 9,
      userId: priya.id,
    },
  });

  // Note 7: Geography (Topographical Sheets)
  const geogNote = await prisma.note.create({
    data: {
      title: 'Topographical Sheets: 4-Figure & 6-Figure Grid References',
      subject: 'GEOG',
      type: 'BLANK',
      isHomework: false,
      fileUrl: '/sheets/hist-1857.json',
      pageCount: 2,
      kudosCount: 11,
      userId: varun.id,
    },
  });

  // Note 8: English Language (Formal Letters)
  const eng1Note = await prisma.note.create({
    data: {
      title: 'Formal Letter Writing & Direct-Indirect Speech Conversion Rules',
      subject: 'ENG1',
      type: 'SOLVED',
      isHomework: false,
      fileUrl: '/sheets/hindi-sandhi.json',
      pageCount: 2,
      kudosCount: 18,
      userId: ananya.id,
    },
  });

  // Note 9: English Literature (Merchant of Venice)
  const eng2Note = await prisma.note.create({
    data: {
      title: 'The Merchant of Venice: Act 1 Scene 2 Key Quotes & Analysis',
      subject: 'ENG2',
      type: 'SOLVED',
      isHomework: false,
      fileUrl: '/sheets/hist-1857.json',
      pageCount: 3,
      kudosCount: 16,
      userId: ananya.id,
    },
  });

  // Note 10: Computer Studies (Java Loops)
  const compNote = await prisma.note.create({
    data: {
      title: 'Java Loops & Conditional Statements (if-else, while, for)',
      subject: 'COMP',
      type: 'SOLVED',
      isHomework: false,
      fileUrl: '/sheets/math-factorisation.json',
      pageCount: 4,
      kudosCount: 21,
      userId: rohan.id,
    },
  });

  // Note 11: Marathi (Vyakaran & Swadhyay)
  const marathiNote = await prisma.note.create({
    data: {
      title: 'मराठी व्याकरण: नाम, सर्वनाम व काळ (Tenses) सराव पत्रिका',
      subject: 'MAR',
      type: 'HW',
      isHomework: true,
      dueDay: 'Friday',
      dueTime: '8:30 AM (Morning)',
      fileUrl: '/sheets/hindi-sandhi.json',
      pageCount: 2,
      kudosCount: 14,
      userId: ananya.id,
    },
  });

  console.log('Seeding bookmarks for Aarav...');
  await prisma.bookmark.create({
    data: {
      userId: aarav.id,
      noteId: mathNote.id,
    },
  });
  await prisma.bookmark.create({
    data: {
      userId: aarav.id,
      noteId: chemNote.id,
    },
  });

  console.log('Seeding requests...');
  await prisma.noteRequest.create({
    data: {
      title: 'Need Chemistry Ch 4 Atomic Structure Worksheet',
      subject: 'CHEM',
      description: "Was absent on Tuesday. Need the questions given in class with Dalton's atomic theory.",
      isFulfilled: false,
      userId: priya.id,
    },
  });

  await prisma.noteRequest.create({
    data: {
      title: 'Physics Archimedes Principle & Floatation Numericals',
      subject: 'PHYS',
      description: 'Missed Friday practical session. Could someone share the numerical problems given from Concise Physics?',
      isFulfilled: false,
      userId: aarav.id,
    },
  });

  await prisma.noteRequest.create({
    data: {
      title: 'Biology Endocrine Glands & Hormones Summary Chart',
      subject: 'BIO',
      description: 'Need the comparative table between thyroid, pituitary and adrenal glands done in 8-B.',
      isFulfilled: true,
      userId: ananya.id,
    },
  });

  console.log('Seeding doubts & answers...');
  const doubt1 = await prisma.question.create({
    data: {
      title: 'How do we factorise x² + 9x + 20 using middle term splitting?',
      subject: 'MATH',
      isSolved: true,
      upvotes: 14,
      userId: aarav.id,
      noteId: mathNote.id,
    },
  });

  await prisma.answer.create({
    data: {
      content: 'Factors of 20 are 4 and 5 (4 × 5 = 20 and 4 + 5 = 9).\n= x² + 4x + 5x + 20\n= x(x + 4) + 5(x + 4)\n= (x + 4)(x + 5)',
      isAccepted: true,
      questionId: doubt1.id,
      userId: rohan.id,
    },
  });

  console.log('Seeding notifications for Aarav...');
  await prisma.notification.createMany({
    data: [
      {
        userId: aarav.id,
        title: 'Homework Due Tomorrow!',
        message: 'Math Ex 7.2 due by 8:00 AM.',
        type: 'HOMEWORK_DUE',
        isRead: false,
      },
      {
        userId: aarav.id,
        title: 'Rohan answered your doubt!',
        message: 'Answered your question on Ch 7 Factorisation.',
        type: 'ANSWERED',
        isRead: false,
      },
      {
        userId: aarav.id,
        title: 'Varun uploaded History notes!',
        message: 'New notes on The Great Uprising of 1857.',
        type: 'NOTE_UPLOADED',
        isRead: false,
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
