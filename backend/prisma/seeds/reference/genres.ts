import prisma from '../../../src/config/prisma';

const GENRES = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Sci-Fi',
  'Thriller',
  'Romance',
  'Animation',
  'Documentary',
  'Fantasy',
];

export const seedGenres = async () => {
  for (const name of GENRES) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`Seeded ${GENRES.length} genres`);
};
