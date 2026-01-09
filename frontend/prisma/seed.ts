// Seed script for initial Kasturi data
// Run with: npx prisma db seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Kasturi database...');

  // ============================================================================
  // Create Bahasa Banjar Program (Language)
  // ============================================================================
  
  const programId = 'bahasa-banjar';

  const program = await prisma.program.upsert({
    where: { programId },
    update: {
      name: 'Bahasa Banjar',
      description: 'Bahasa daerah yang digunakan oleh suku Banjar di Kalimantan Selatan. Pelajari cara berkomunikasi dengan penduduk lokal dalam kehidupan sehari-hari.',
      totalExp: 50,
    },
    create: {
      programId,
      name: 'Bahasa Banjar',
      description: 'Bahasa daerah yang digunakan oleh suku Banjar di Kalimantan Selatan. Pelajari cara berkomunikasi dengan penduduk lokal dalam kehidupan sehari-hari.',
      language: 'banjar',
      totalExp: 50,
      isActive: true,
    },
  });

  console.log(`✅ Created program: ${program.name} (${program.programId})`);

  // ============================================================================
  // Create Module: Belajar Bahasa Banjar Lewat Lagu
  // ============================================================================

  const moduleId = 'belajar-banjar-lewat-lagu';

  const module = await prisma.module.upsert({
    where: { moduleId },
    update: {
      name: 'Belajar Bahasa Banjar Lewat Lagu',
      description: 'Pelajari Bahasa Banjar melalui lirik lagu-lagu populer karya Tommy Kaganangan. Cara menyenangkan untuk memahami ekspresi dan emosi dalam bahasa daerah.',
      totalExp: 50,
    },
    create: {
      moduleId,
      programId: program.id,
      name: 'Belajar Bahasa Banjar Lewat Lagu',
      description: 'Pelajari Bahasa Banjar melalui lirik lagu-lagu populer karya Tommy Kaganangan. Cara menyenangkan untuk memahami ekspresi dan emosi dalam bahasa daerah.',
      level: 'beginner',
      totalExp: 50,
      orderIndex: 1,
      isActive: true,
    },
  });

  console.log(`  ✅ Created module: ${module.name}`);

  // ============================================================================
  // Create Lessons
  // ============================================================================

  const lessons = [
    {
      title: 'Cinta, Janji, dan Perpisahan',
      description: 'Belajar ekspresi cinta dan perpisahan dalam Bahasa Banjar melalui lirik lagu',
      expReward: 10,
      orderIndex: 1,
      videoUrl: 'https://www.youtube.com/watch?v=Jv8hybk9_oE',
      duration: '4 menit',
      content: {
        vocabulary: [
          { banjar: 'ulun / lun', indonesian: 'aku', english: 'I/me' },
          { banjar: 'pian', indonesian: 'kamu', english: 'you' },
          { banjar: 'kamana', indonesian: 'ke mana', english: 'where to' },
          { banjar: 'maninggalakan', indonesian: 'meninggalkan', english: 'to leave' },
          { banjar: 'purun', indonesian: 'tega', english: 'cruel/heartless' },
          { banjar: 'bajanji', indonesian: 'berjanji', english: 'to promise' },
          { banjar: 'pacang', indonesian: 'akan', english: 'will' },
          { banjar: 'kada', indonesian: 'tidak', english: 'not' },
          { banjar: 'mambuliki', indonesian: 'kembali', english: 'to return' },
          { banjar: 'manyayangi', indonesian: 'menyayangi', english: 'to love' },
          { banjar: 'nang', indonesian: 'yang', english: 'that/which' },
          { banjar: 'lawan', indonesian: 'dengan', english: 'with' },
          { banjar: 'inya', indonesian: 'dia', english: 'he/she' },
          { banjar: 'mudahan', indonesian: 'semoga', english: 'hopefully' },
          { banjar: 'bahagia', indonesian: 'bahagia', english: 'happy' },
        ],
        exercises: [
          {
            type: 'multiple-choice',
            question: 'Apa arti "ulun" dalam Bahasa Indonesia?',
            options: ['kamu', 'aku', 'dia', 'mereka'],
            correct: 1,
          },
          {
            type: 'multiple-choice',
            question: 'Kata "pacang" dalam Bahasa Banjar berarti...',
            options: ['sudah', 'akan', 'sedang', 'tidak'],
            correct: 1,
          },
          {
            type: 'multiple-choice',
            question: '"Kada pacang lagi" artinya adalah...',
            options: ['Akan lagi', 'Tidak akan lagi', 'Sudah lagi', 'Belum lagi'],
            correct: 1,
          },
        ],
      },
    },
    {
      title: 'Curhat, Nasib, dan Humor Banjar',
      description: 'Belajar mengekspresikan keluhan dan humor dalam Bahasa Banjar',
      expReward: 10,
      orderIndex: 2,
      videoUrl: 'https://www.youtube.com/watch?v=ay3GEOdqwRs',
      duration: '3 menit',
      content: {
        vocabulary: [
          { banjar: 'gim', indonesian: 'sial / apes', english: 'unlucky' },
          { banjar: 'kisah', indonesian: 'nasib', english: 'fate' },
          { banjar: 'gin', indonesian: 'sekali / banget', english: 'very' },
          { banjar: 'rakai', indonesian: 'menangis', english: 'to cry' },
          { banjar: 'kayapa', indonesian: 'bagaimana', english: 'how' },
          { banjar: 'amun', indonesian: 'kalau', english: 'if' },
          { banjar: 'bisi', indonesian: 'ada', english: 'have/there is' },
          { banjar: 'bagana', indonesian: 'diam', english: 'silent/stay' },
          { banjar: 'handak', indonesian: 'ingin', english: 'want' },
          { banjar: 'baduaan', indonesian: 'berdua', english: 'together (two)' },
          { banjar: 'karing', indonesian: 'kering', english: 'dry/empty' },
          { banjar: 'mangawani', indonesian: 'menemani', english: 'to accompany' },
          { banjar: 'camuh', indonesian: 'susah', english: 'difficult' },
        ],
        exercises: [
          {
            type: 'multiple-choice',
            question: '"Gim" dalam Bahasa Indonesia artinya...',
            options: ['senang', 'sial', 'sedih', 'marah'],
            correct: 1,
          },
          {
            type: 'multiple-choice',
            question: '"Amun duit kada bisi" artinya...',
            options: ['Kalau uang ada', 'Kalau uang tidak ada', 'Kalau uang banyak', 'Kalau uang sedikit'],
            correct: 1,
          },
          {
            type: 'multiple-choice',
            question: 'Kata "handak" berarti...',
            options: ['sudah', 'belum', 'ingin', 'tidak'],
            correct: 2,
          },
        ],
      },
    },
    {
      title: 'Ayuha - Ikhlas dan Melepaskan',
      description: 'Belajar ekspresi keikhlasan dan melepaskan dalam Bahasa Banjar',
      expReward: 10,
      orderIndex: 3,
      videoUrl: 'https://www.youtube.com/watch?v=dCgnP-vnhIc',
      duration: '4 menit',
      content: {
        vocabulary: [
          { banjar: 'kanapa', indonesian: 'kenapa', english: 'why' },
          { banjar: 'urangnya', indonesian: 'orangnya', english: 'the person' },
          { banjar: 'mun', indonesian: 'kalau', english: 'if' },
          { banjar: 'salingkuh', indonesian: 'selingkuh', english: 'to cheat' },
          { banjar: 'purun', indonesian: 'tega', english: 'cruel' },
          { banjar: 'mambari', indonesian: 'memberi', english: 'to give' },
          { banjar: 'muar', indonesian: 'luka', english: 'wound' },
          { banjar: 'maharitt', indonesian: 'sangat perih', english: 'very painful' },
          { banjar: 'ayuha', indonesian: 'ya sudah / sudahlah', english: 'let it be' },
          { banjar: 'kada papa', indonesian: 'tidak apa-apa', english: 'it\'s okay' },
          { banjar: 'mudahan', indonesian: 'semoga', english: 'hopefully' },
          { banjar: 'marana', indonesian: 'menderita', english: 'to suffer' },
          { banjar: 'bajauh', indonesian: 'menjauh', english: 'to distance' },
          { banjar: 'kacewa', indonesian: 'kecewa', english: 'disappointed' },
        ],
        exercises: [
          {
            type: 'multiple-choice',
            question: '"Ayuha" dalam konteks lagu ini berarti...',
            options: ['marah', 'senang', 'ya sudah/ikhlas', 'sedih'],
            correct: 2,
          },
          {
            type: 'multiple-choice',
            question: '"Mun sudah kada cinta" artinya...',
            options: ['Kalau sudah cinta', 'Kalau sudah tidak cinta', 'Kalau belum cinta', 'Kalau masih cinta'],
            correct: 1,
          },
          {
            type: 'multiple-choice',
            question: 'Ekspresi "kada papa" menunjukkan sikap...',
            options: ['marah', 'ikhlas', 'dendam', 'bahagia'],
            correct: 1,
          },
        ],
      },
    },
    {
      title: 'Ratik Wara - Salah Paham dan Harga Diri',
      description: 'Belajar mengekspresikan kekecewaan dan harga diri dalam Bahasa Banjar',
      expReward: 10,
      orderIndex: 4,
      videoUrl: 'https://www.youtube.com/watch?v=TmAxPEkTFIA',
      duration: '4 menit',
      content: {
        vocabulary: [
          { banjar: 'ikam', indonesian: 'kamu', english: 'you' },
          { banjar: 'bapadah', indonesian: 'berbicara', english: 'to speak' },
          { banjar: 'imbah', indonesian: 'setelah / ketika', english: 'after/when' },
          { banjar: 'lawas', indonesian: 'lama', english: 'long time' },
          { banjar: 'basama', indonesian: 'bersama', english: 'together' },
          { banjar: 'salah sangka', indonesian: 'salah paham', english: 'misunderstanding' },
          { banjar: 'saban hari', indonesian: 'setiap hari', english: 'every day' },
          { banjar: 'gasan', indonesian: 'untuk', english: 'for' },
          { banjar: 'kadada', indonesian: 'tidak ada', english: 'nothing/none' },
          { banjar: 'takajut', indonesian: 'terkejut', english: 'shocked' },
          { banjar: 'bajalan', indonesian: 'berjalan', english: 'to walk' },
          { banjar: 'baundur', indonesian: 'mundur', english: 'to retreat' },
          { banjar: 'sia-sia', indonesian: 'percuma', english: 'in vain' },
          { banjar: 'ratik wara', indonesian: 'hancur perasaan', english: 'heartbroken' },
        ],
        exercises: [
          {
            type: 'multiple-choice',
            question: '"Ratik wara" dalam Bahasa Indonesia berarti...',
            options: ['senang', 'hancur perasaan', 'marah', 'bingung'],
            correct: 1,
          },
          {
            type: 'multiple-choice',
            question: '"Baik ulun baundur haja" artinya...',
            options: ['Aku maju saja', 'Aku mundur saja', 'Aku diam saja', 'Aku pergi saja'],
            correct: 1,
          },
          {
            type: 'multiple-choice',
            question: 'Kata "imbah" berarti...',
            options: ['sebelum', 'setelah', 'selama', 'sampai'],
            correct: 1,
          },
        ],
      },
    },
    {
      title: 'Rakai - Cemburu dan Kenyataan Pahit',
      description: 'Belajar mengekspresikan kecemburuan dan menghadapi kenyataan dalam Bahasa Banjar',
      expReward: 10,
      orderIndex: 5,
      videoUrl: 'https://www.youtube.com/watch?v=bk5FEUyOiEs',
      duration: '4 menit',
      content: {
        vocabulary: [
          { banjar: 'rakai', indonesian: 'cemburu / perih hati', english: 'jealous' },
          { banjar: 'banar', indonesian: 'sangat', english: 'very' },
          { banjar: 'tuhuk', indonesian: 'sungguh-sungguh', english: 'seriously' },
          { banjar: 'bajuang', indonesian: 'berjuang', english: 'to struggle' },
          { banjar: 'bujur', indonesian: 'memang', english: 'indeed' },
          { banjar: 'bungas', indonesian: 'cantik', english: 'beautiful' },
          { banjar: 'maras', indonesian: 'sakit / perih', english: 'painful' },
          { banjar: 'jaka pang kawa', indonesian: 'kalau memang bisa', english: 'if possible' },
          { banjar: 'mulanya', indonesian: 'awalnya', english: 'at first' },
          { banjar: 'pina', indonesian: 'beda', english: 'different' },
          { banjar: 'balain', indonesian: 'berbeda', english: 'to differ' },
          { banjar: 'taciduk', indonesian: 'memergoki', english: 'to catch' },
          { banjar: 'bagandeng tangan', indonesian: 'bergandengan tangan', english: 'holding hands' },
          { banjar: 'kada sing lapasan', indonesian: 'tak bisa diingkari', english: 'undeniable' },
        ],
        exercises: [
          {
            type: 'multiple-choice',
            question: '"Rakai" dalam konteks emosi berarti...',
            options: ['senang', 'cemburu', 'marah', 'takut'],
            correct: 1,
          },
          {
            type: 'multiple-choice',
            question: '"Taciduk pian di kajauhan" artinya...',
            options: ['Melihatmu dari jauh', 'Memergokimu dari jauh', 'Mencarmu dari jauh', 'Merindukanmu dari jauh'],
            correct: 1,
          },
          {
            type: 'multiple-choice',
            question: 'Frasa "jaka pang kawa" menunjukkan...',
            options: ['perintah', 'permintaan lembut', 'larangan', 'paksaan'],
            correct: 1,
          },
        ],
      },
    },
  ];

  for (const lessonData of lessons) {
    // Generate thumbnail URL from YouTube video ID
    let thumbnailUrl = null;
    if (lessonData.videoUrl) {
      const videoIdMatch = lessonData.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      if (videoIdMatch && videoIdMatch[1]) {
        thumbnailUrl = `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`;
      }
    }

    const lesson = await prisma.lesson.upsert({
      where: {
        moduleId_orderIndex: {
          moduleId: module.id,
          orderIndex: lessonData.orderIndex,
        },
      },
      update: {
        title: lessonData.title,
        description: lessonData.description,
        content: lessonData.content,
        expReward: lessonData.expReward,
        videoUrl: lessonData.videoUrl,
        thumbnailUrl,
        duration: lessonData.duration,
      },
      create: {
        moduleId: module.id,
        title: lessonData.title,
        description: lessonData.description,
        content: lessonData.content,
        expReward: lessonData.expReward,
        orderIndex: lessonData.orderIndex,
        videoUrl: lessonData.videoUrl,
        thumbnailUrl,
        duration: lessonData.duration,
        isActive: true,
      },
    });

    console.log(`    ✅ Lesson ${lesson.orderIndex}: ${lesson.title}`);
  }

  console.log('\n🎉 Seeding completed!');
  console.log(`\n📋 Program ID (for on-chain credential): ${programId}`);
  console.log(`📋 Module ID: ${moduleId}`);
  console.log('   Use Program ID when issuing credentials via smart contract');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
