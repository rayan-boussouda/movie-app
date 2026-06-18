import prisma from '../../../src/config/prisma';
import { faker } from '@faker-js/faker';
import { UserMovieStatus } from '@prisma/client';

const STATUSES: UserMovieStatus[] = ['WATCHLIST', 'WATCHED', 'FAVORITE'];

export const seedUserMovies = async () => {
  const users = await prisma.user.findMany({ where: { role: 'USER' } });
  const movies = await prisma.movie.findMany();

  const entries = users.flatMap((user) => {
    const selectedMovies = faker.helpers.arrayElements(movies, {
      min: 3,
      max: 6,
    });
    return selectedMovies.map((movie) => ({
      userId: user.id,
      movieId: movie.id,
      status: faker.helpers.arrayElement(STATUSES),
    }));
  });

  await prisma.userMovie.createMany({ data: entries, skipDuplicates: true });

  console.log(`Seeded ${entries.length} user-movie entries`);
};
