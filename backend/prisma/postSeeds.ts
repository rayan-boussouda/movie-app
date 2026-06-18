import prisma from '../src/config/prisma';

const main = async () => {
  await prisma.post.createMany({
    data: Array.from({ length: 50 }, (_, i) => ({
      title: `Alice post ${i + 1}`,
      content: `This is Alice's post number ${i + 1}.`,
      userId: 2,
    })),
  });

  console.log('Seeded: 50 posts for Alice');
};

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
