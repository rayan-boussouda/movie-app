import prisma from '../src/config/prisma';
import { seedGenres } from './seeds/reference/genres';
import { seedAdmin } from './seeds/reference/admin';
import { seedUsers } from './seeds/sample/users';
import { seedMovies } from './seeds/sample/movies';
import { seedUserMovies } from './seeds/sample/userMovies';
import { seedRatings } from './seeds/sample/ratings';
import { seedReviews } from './seeds/sample/reviews';

async function main() {
  // Reference — always
  await seedGenres();
  await seedAdmin();

  // Sample — dev only
  if (process.env.NODE_ENV !== 'production') {
    await seedUsers();
    await seedMovies(); // depends on genres
    await seedUserMovies(); // depends on users + movies
    await seedRatings(); // depends on users + movies
    await seedReviews(); // depends on users + movies
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
