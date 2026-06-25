import prisma from '../../../src/config/prisma';
import { faker } from '@faker-js/faker';

export const seedRatings = async () => {
  const users = await prisma.user.findMany({ where: { role: 'USER' } });
  const movies = await prisma.movie.findMany();

  const entries = users.flatMap((user) => {
    const selectedMovies = faker.helpers.arrayElements(movies, { min: 3, max: 8 });
    return selectedMovies.map((movie) => ({
      userId: user.id,
      movieId: movie.id,
      value: faker.number.int({ min: 1, max: 5 }),
    }));
  });

  await prisma.rating.createMany({ data: entries, skipDuplicates: true });

  // Recalculate averageRating + ratingCount for each movie
  for (const movie of movies) {
    const ratings = await prisma.rating.findMany({ where: { movieId: movie.id } });
    if (ratings.length > 0) {
      const avg = ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;
      await prisma.movie.update({
        where: { id: movie.id },
        data: { averageRating: avg, ratingCount: ratings.length },
      });
    }
  }

  console.log(`Seeded ${entries.length} ratings`);
};
