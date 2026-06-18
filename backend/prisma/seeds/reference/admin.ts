import prisma from '../../../src/config/prisma';
import bcrypt from 'bcrypt';

export const seedAdmin = async () => {
  const password = await bcrypt.hash('admin1234', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password,
      role: 'ADMIN',
    },
  });

  console.log('Seeded admin user');
};
