import prisma from '../../../src/config/prisma';
import { faker } from '@faker-js/faker';

const MOVIE_COUNT = 20;

export const seedMovies = async () => {
  const genres = await prisma.genre.findMany();

  for (let i = 0; i < MOVIE_COUNT; i++) {
    const title = faker.lorem.words({ min: 2, max: 4 });
    const randomGenres = faker.helpers
      .arrayElements(genres, { min: 1, max: 3 })
      .map((g) => ({ id: g.id }));

    await prisma.movie.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        title,
        synopsis: faker.lorem.paragraph(),
        posterUrl: faker.image.url(),
        releaseYear: faker.date.between({
          from: '1990-01-01',
          to: '2024-12-31',
        }),
        genres: { connect: randomGenres },
      },
    });
  }

  console.log(`Seeded ${MOVIE_COUNT} movies`);
};
