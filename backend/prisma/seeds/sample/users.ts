import prisma from '../../../src/config/prisma';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const USER_COUNT = 10;
const DEFAULT_PASSWORD = 'password123';

export const seedUsers = async () => {
  const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  for (let i = 0; i < USER_COUNT; i++) {
    const email = faker.internet.email().toLowerCase();

    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: faker.person.fullName(),
        email,
        password: hashed,
        role: 'USER',
      },
    });
  }

  console.log(`Seeded ${USER_COUNT} users (password: ${DEFAULT_PASSWORD})`);
};
