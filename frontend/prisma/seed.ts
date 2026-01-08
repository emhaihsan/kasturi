// Seed script for initial Kasturi data
// Run with: npx prisma db seed

import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

// Generate programId from name (keccak256 hash)
function generateProgramId(name: string): string {
  return '0x' + createHash('sha3-256').update(name).digest('hex');
}

async function main() {
  console.log('🌱 Seeding Kasturi database...');

  // ============================================================================
  // Create Bahasa Banjar Program
  // ============================================================================
  
  const programName = 'bahasa-banjar-basic';
  const programId = generateProgramId(programName);

  const program = await prisma.program.upsert({
    where: { programId },
    update: {},
    create: {
      programId,
      name: 'Bahasa Banjar Basic',
      description: 'Learn the basics of Bahasa Banjar, the traditional language of South Kalimantan',
      language: 'banjar',
      level: 'beginner',
      totalExp: 50,
      isActive: true,
    },
  });

  console.log(`✅ Created program: ${program.name} (${program.programId})`);

  // ============================================================================
  // Create Lessons
  // ============================================================================

  const lessons = [
    {
      title: 'Sapaan Dasar (Basic Greetings)',
      description: 'Learn how to greet people in Bahasa Banjar',
      expReward: 10,
      orderIndex: 1,
      content: {
        vocabulary: [
          { banjar: 'Apa kabar?', indonesian: 'Bagaimana kabar?', english: 'How are you?', audio: null },
          { banjar: 'Baik haja', indonesian: 'Baik saja', english: "I'm fine", audio: null },
          { banjar: 'Siapa ngaran ikam?', indonesian: 'Siapa nama kamu?', english: "What's your name?", audio: null },
          { banjar: 'Ngaranku...', indonesian: 'Namaku...', english: 'My name is...', audio: null },
          { banjar: 'Salamat pagi', indonesian: 'Selamat pagi', english: 'Good morning', audio: null },
        ],
        exercises: [
          {
            type: 'multiple-choice',
            question: 'Apa arti "Apa kabar?" dalam Bahasa Indonesia?',
            options: ['Bagaimana kabar?', 'Siapa kamu?', 'Terima kasih', 'Selamat tinggal'],
            correct: 0,
          },
          {
            type: 'multiple-choice',
            question: 'Bagaimana cara mengatakan "Good morning" dalam Bahasa Banjar?',
            options: ['Baik haja', 'Salamat pagi', 'Apa kabar?', 'Ngaranku'],
            correct: 1,
          },
          {
            type: 'fill-blank',
            question: 'Lengkapi: "Siapa _____ ikam?" (nama)',
            answer: 'ngaran',
          },
        ],
      },
    },
    {
      title: 'Angka-Angka (Numbers)',
      description: 'Learn to count in Bahasa Banjar',
      expReward: 10,
      orderIndex: 2,
      content: {
        vocabulary: [
          { banjar: 'Satu', indonesian: 'Satu', english: 'One', audio: null },
          { banjar: 'Dua', indonesian: 'Dua', english: 'Two', audio: null },
          { banjar: 'Tiga', indonesian: 'Tiga', english: 'Three', audio: null },
          { banjar: 'Ampat', indonesian: 'Empat', english: 'Four', audio: null },
          { banjar: 'Lima', indonesian: 'Lima', english: 'Five', audio: null },
          { banjar: 'Anam', indonesian: 'Enam', english: 'Six', audio: null },
          { banjar: 'Tujuh', indonesian: 'Tujuh', english: 'Seven', audio: null },
          { banjar: 'Lapan', indonesian: 'Delapan', english: 'Eight', audio: null },
          { banjar: 'Sambilan', indonesian: 'Sembilan', english: 'Nine', audio: null },
          { banjar: 'Sapuluh', indonesian: 'Sepuluh', english: 'Ten', audio: null },
        ],
        exercises: [
          {
            type: 'multiple-choice',
            question: 'Apa Bahasa Banjar untuk angka "4"?',
            options: ['Tiga', 'Ampat', 'Lima', 'Anam'],
            correct: 1,
          },
          {
            type: 'multiple-choice',
            question: '"Lapan" dalam Bahasa Indonesia adalah...',
            options: ['Tujuh', 'Delapan', 'Sembilan', 'Sepuluh'],
            correct: 1,
          },
          {
            type: 'ordering',
            question: 'Urutkan angka dari kecil ke besar: Tiga, Satu, Dua',
            answer: ['Satu', 'Dua', 'Tiga'],
          },
        ],
      },
    },
    {
      title: 'Keluarga (Family)',
      description: 'Learn family member names in Bahasa Banjar',
      expReward: 10,
      orderIndex: 3,
      content: {
        vocabulary: [
          { banjar: 'Abah', indonesian: 'Ayah', english: 'Father', audio: null },
          { banjar: 'Uma', indonesian: 'Ibu', english: 'Mother', audio: null },
          { banjar: 'Dangsanak', indonesian: 'Saudara', english: 'Sibling', audio: null },
          { banjar: 'Kaka', indonesian: 'Kakak', english: 'Older sibling', audio: null },
          { banjar: 'Ading', indonesian: 'Adik', english: 'Younger sibling', audio: null },
          { banjar: 'Kai', indonesian: 'Kakek', english: 'Grandfather', audio: null },
          { banjar: 'Nini', indonesian: 'Nenek', english: 'Grandmother', audio: null },
        ],
        exercises: [
          {
            type: 'multiple-choice',
            question: 'Apa Bahasa Banjar untuk "Ibu"?',
            options: ['Abah', 'Uma', 'Kaka', 'Nini'],
            correct: 1,
          },
          {
            type: 'matching',
            question: 'Pasangkan kata Banjar dengan artinya',
            pairs: [
              { banjar: 'Kai', answer: 'Kakek' },
              { banjar: 'Ading', answer: 'Adik' },
              { banjar: 'Abah', answer: 'Ayah' },
            ],
          },
        ],
      },
    },
    {
      title: 'Makanan (Food)',
      description: 'Learn food-related vocabulary in Bahasa Banjar',
      expReward: 10,
      orderIndex: 4,
      content: {
        vocabulary: [
          { banjar: 'Nasi', indonesian: 'Nasi', english: 'Rice', audio: null },
          { banjar: 'Iwak', indonesian: 'Ikan', english: 'Fish', audio: null },
          { banjar: 'Soto Banjar', indonesian: 'Soto Banjar', english: 'Banjar Soup', audio: null },
          { banjar: 'Wadai', indonesian: 'Kue', english: 'Cake/Snack', audio: null },
          { banjar: 'Lauk', indonesian: 'Lauk', english: 'Side dish', audio: null },
          { banjar: 'Sayur', indonesian: 'Sayur', english: 'Vegetable', audio: null },
          { banjar: 'Banyu', indonesian: 'Air', english: 'Water', audio: null },
        ],
        exercises: [
          {
            type: 'multiple-choice',
            question: '"Iwak" dalam Bahasa Indonesia adalah...',
            options: ['Daging', 'Ikan', 'Ayam', 'Udang'],
            correct: 1,
          },
          {
            type: 'multiple-choice',
            question: 'Makanan khas Banjar yang berupa sup adalah...',
            options: ['Wadai', 'Soto Banjar', 'Lauk', 'Sayur'],
            correct: 1,
          },
        ],
      },
    },
    {
      title: 'Tempat dan Arah (Places and Directions)',
      description: 'Learn places and directions in Bahasa Banjar',
      expReward: 10,
      orderIndex: 5,
      content: {
        vocabulary: [
          { banjar: 'Rumah', indonesian: 'Rumah', english: 'House', audio: null },
          { banjar: 'Pasar', indonesian: 'Pasar', english: 'Market', audio: null },
          { banjar: 'Pasar Terapung', indonesian: 'Pasar Terapung', english: 'Floating Market', audio: null },
          { banjar: 'Sungai', indonesian: 'Sungai', english: 'River', audio: null },
          { banjar: 'Kanan', indonesian: 'Kanan', english: 'Right', audio: null },
          { banjar: 'Kiri', indonesian: 'Kiri', english: 'Left', audio: null },
          { banjar: 'Lurus', indonesian: 'Lurus', english: 'Straight', audio: null },
          { banjar: 'Jauh', indonesian: 'Jauh', english: 'Far', audio: null },
          { banjar: 'Parak', indonesian: 'Dekat', english: 'Near', audio: null },
        ],
        exercises: [
          {
            type: 'multiple-choice',
            question: 'Apa Bahasa Banjar untuk "Dekat"?',
            options: ['Jauh', 'Parak', 'Lurus', 'Kanan'],
            correct: 1,
          },
          {
            type: 'multiple-choice',
            question: 'Pasar yang ada di atas sungai disebut...',
            options: ['Pasar Malam', 'Pasar Terapung', 'Pasar Baru', 'Pasar Ikan'],
            correct: 1,
          },
          {
            type: 'fill-blank',
            question: 'Untuk menuju pasar, belok _____ di perempatan. (kanan)',
            answer: 'kanan',
          },
        ],
      },
    },
  ];

  for (const lessonData of lessons) {
    const lesson = await prisma.lesson.upsert({
      where: {
        programId_orderIndex: {
          programId: program.id,
          orderIndex: lessonData.orderIndex,
        },
      },
      update: {
        title: lessonData.title,
        description: lessonData.description,
        content: lessonData.content,
        expReward: lessonData.expReward,
      },
      create: {
        programId: program.id,
        title: lessonData.title,
        description: lessonData.description,
        content: lessonData.content,
        expReward: lessonData.expReward,
        orderIndex: lessonData.orderIndex,
        isActive: true,
      },
    });

    console.log(`  ✅ Lesson ${lesson.orderIndex}: ${lesson.title}`);
  }

  console.log('\n🎉 Seeding completed!');
  console.log(`\n📋 Program ID (for on-chain): ${programId}`);
  console.log('   Use this when issuing credentials via smart contract');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
