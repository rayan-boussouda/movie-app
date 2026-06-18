import prisma from '../../../src/config/prisma';
import { faker } from '@faker-js/faker';

export const seedReviews = async () => {
  const users = await prisma.user.findMany({ where: { role: 'USER' } });
  const movies = await prisma.movie.findMany();

  let count = 0;

  for (const user of users) {
    const selectedMovies = faker.helpers.arrayElements(movies, {
      min: 2,
      max: 5,
    });

    for (const movie of selectedMovies) {
      const existing = await prisma.review.findFirst({
        where: { userId: user.id, movieId: movie.id },
      });

      if (!existing) {
        await prisma.review.create({
          data: {
            userId: user.id,
            movieId: movie.id,
            content: faker.lorem.paragraph({ min: 1, max: 3 }),
          },
        });
        count++;
      }
    }
  }

  console.log(`Seeded ${count} reviews`);
};
