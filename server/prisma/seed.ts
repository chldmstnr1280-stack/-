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

  // Add shop items (Phase 2)
  const shopItems = [
    // Outfits
    { key: 'hat-party', title: 'Party Hat', type: 'outfit', price: 50 },
    { key: 'hat-wizard', title: 'Wizard Hat', type: 'outfit', price: 100 },
    { key: 'hat-flower', title: 'Flower Crown', type: 'outfit', price: 75 },
    { key: 'glasses-cool', title: 'Cool Sunglasses', type: 'outfit', price: 60 },
    { key: 'scarf-cozy', title: 'Cozy Scarf', type: 'outfit', price: 40 },

    // Decor
    { key: 'pot-ceramic', title: 'Ceramic Pot', type: 'decor', price: 30 },
    { key: 'pot-gold', title: 'Golden Pot', type: 'decor', price: 150 },
    { key: 'fence-white', title: 'White Fence', type: 'decor', price: 45 },
    { key: 'bench-wooden', title: 'Wooden Bench', type: 'decor', price: 80 },
    { key: 'lamp-garden', title: 'Garden Lamp', type: 'decor', price: 90 },
    { key: 'fountain-mini', title: 'Mini Fountain', type: 'decor', price: 120 },

    // Boosts
    { key: 'boost-energy', title: 'Energy Boost', type: 'boost', price: 20 },
    { key: 'boost-calm', title: 'Calm Boost', type: 'boost', price: 20 },
    { key: 'boost-growth', title: 'Growth Accelerator', type: 'boost', price: 35 },
  ];

  for (const item of shopItems) {
    await prisma.shopItem.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }

  console.log(`✅ Created ${shopItems.length} shop items`);

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
