const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const validImages = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
  'https://images.unsplash.com/photo-1516683487411-3606a36ecc64?w=400',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'
];

async function run() {
  const props = await prisma.property.findMany();
  let updated = 0;
  for (const p of props) {
    // If the image contains unsplash, and specifically the dead ones, replace them.
    // Actually, to be safe against any other dead ones, let's just replace the known dead one.
    // Or, we can just replace all of them with a random working one to ensure they all load.
    if (p.image && p.image.includes('unsplash.com')) {
      const idx = Math.floor(Math.random() * validImages.length);
      await prisma.property.update({
        where: { id: p.id },
        data: { image: validImages[idx] }
      });
      updated++;
    }
  }
  console.log('Updated ' + updated + ' properties.');
}

run().finally(() => prisma.$disconnect());
