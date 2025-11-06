import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@sellery.app' },
    update: {},
    create: {
      email: 'demo@sellery.app',
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create mascot state
  await prisma.mascotState.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      stage: 'seed',
      score: 0,
    },
  });

  // Create sample emotion entries over the past 7 days
  const emotions = ['happy', 'anxious', 'calm', 'excited', 'sad', 'grateful', 'stressed'];
  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const emotionLabel = emotions[Math.floor(Math.random() * emotions.length)];
    const intensity = Math.floor(Math.random() * 11); // 0-10

    await prisma.emotionEntry.create({
      data: {
        userId: user.id,
        timestamp: date,
        emotionLabel,
        intensity,
        notes: `Sample note for day ${i + 1}`,
        tags: JSON.stringify(['sample', 'seed']),
      },
    });
  }

  console.log('✅ Created 7 sample emotion entries');

  // Add some shop items (Phase 2 stub)
  const shopItems = [
    { key: 'hat-party', title: 'Party Hat', type: 'outfit', price: 50 },
    { key: 'plant-pot', title: 'Ceramic Pot', type: 'decor', price: 30 },
    { key: 'boost-energy', title: 'Energy Boost', type: 'boost', price: 10 },
  ];

  for (const item of shopItems) {
    await prisma.shopItem.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }

  console.log('✅ Created shop items (Phase 2 stub)');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
