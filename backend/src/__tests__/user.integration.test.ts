import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import prisma from '../config/prisma';

beforeEach(async () => {
  await prisma.passwordResetToken.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.review.deleteMany();
  await prisma.userMovie.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /users', () => {
  it('returns 201 with the created user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'secret123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', 'alice@example.com');
    expect(res.body).toHaveProperty('name', 'Alice');
  });

  it('returns 400 on duplicate email', async () => {
    await prisma.user.create({
      data: { name: 'Alice', email: 'alice@example.com', password: 'hash' },
    });

    const res = await request(app)
      .post('/users')
      .send({ name: 'Alice 2', email: 'alice@example.com', password: 'secret123' });

    expect(res.status).toBe(400);
  });
});

describe('GET /users', () => {
  it('returns 200 with an array of users', async () => {
    await prisma.user.createMany({
      data: [
        { name: 'Bob', email: 'bob@example.com', password: 'hash' },
        { name: 'Carol', email: 'carol@example.com', password: 'hash' },
      ],
    });

    const res = await request(app).get('/users');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });

  it('returns an empty array when no users exist', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /users/:id', () => {
  it('returns 200 with the correct user', async () => {
    const user = await prisma.user.create({
      data: { name: 'Dave', email: 'dave@example.com', password: 'hash' },
    });

    const res = await request(app).get(`/users/${user.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', user.id);
    expect(res.body).toHaveProperty('email', 'dave@example.com');
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).get('/users/99999');
    expect(res.status).toBe(404);
  });
});

describe('PUT /users/:id', () => {
  it('returns 200 with the updated user', async () => {
    const user = await prisma.user.create({
      data: { name: 'Eve', email: 'eve@example.com', password: 'hash' },
    });

    const res = await request(app)
      .put(`/users/${user.id}`)
      .send({ name: 'Eve Updated', email: 'eve@example.com', password: 'hash' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Eve Updated');
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app)
      .put('/users/99999')
      .send({ name: 'Ghost', email: 'ghost@example.com', password: 'hash' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /users/:id', () => {
  it('returns 200 and removes the user from the DB', async () => {
    const user = await prisma.user.create({
      data: { name: 'Frank', email: 'frank@example.com', password: 'hash' },
    });

    const res = await request(app).delete(`/users/${user.id}`);

    expect(res.status).toBe(200);
    const deleted = await prisma.user.findUnique({ where: { id: user.id } });
    expect(deleted).toBeNull();
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).delete('/users/99999');
    expect(res.status).toBe(404);
  });
});
