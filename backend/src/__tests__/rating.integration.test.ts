import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import prisma from '../config/prisma';

let userId: number;
let movieId: number;
let authHeader: { Authorization: string };

beforeEach(async () => {
  await prisma.rating.deleteMany();
  await prisma.review.deleteMany();
  await prisma.userMovie.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: { name: 'Rater', email: 'rater@example.com', password: 'hash' },
  });
  userId = user.id;
  authHeader = {
    Authorization: `Bearer ${jwt.sign(
      { userId: user.id, role: 'USER' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' },
    )}`,
  };

  const movie = await prisma.movie.create({
    data: { title: 'Ratable Movie', synopsis: 'For rating tests', releaseYear: new Date('2020-01-01') },
  });
  movieId = movie.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /ratings', () => {
  it('returns 201 with the created rating', async () => {
    const res = await request(app)
      .post('/ratings')
      .set(authHeader)
      .send({ movieId, value: 4 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('value', 4);
    expect(res.body).toHaveProperty('movieId', movieId);
    expect(res.body).toHaveProperty('userId', userId);
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).post('/ratings').send({ movieId, value: 4 });
    expect(res.status).toBe(401);
  });

  it('returns 400 when value is out of range', async () => {
    const res = await request(app)
      .post('/ratings')
      .set(authHeader)
      .send({ movieId, value: 6 });

    expect(res.status).toBe(400);
  });

  it('returns 409 when the user rates the same movie twice', async () => {
    await prisma.rating.create({ data: { userId, movieId, value: 3 } });

    const res = await request(app)
      .post('/ratings')
      .set(authHeader)
      .send({ movieId, value: 5 });

    expect(res.status).toBe(409);
  });
});

describe('GET /ratings', () => {
  beforeEach(async () => {
    await prisma.rating.create({ data: { userId, movieId, value: 3 } });
  });

  it('returns 200 with ratings for a movie', async () => {
    const res = await request(app)
      .get(`/ratings?movieId=${movieId}`)
      .set(authHeader);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('value', 3);
  });

  it('returns 400 when movieId is missing', async () => {
    const res = await request(app).get('/ratings').set(authHeader);
    expect(res.status).toBe(400);
  });
});

describe('PATCH /ratings/:id', () => {
  it('returns 200 with the updated value', async () => {
    const rating = await prisma.rating.create({ data: { userId, movieId, value: 2 } });

    const res = await request(app)
      .patch(`/ratings/${rating.id}`)
      .set(authHeader)
      .send({ value: 5 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('value', 5);
  });

  it('returns 401 without a token', async () => {
    const rating = await prisma.rating.create({ data: { userId, movieId, value: 2 } });

    const res = await request(app)
      .patch(`/ratings/${rating.id}`)
      .send({ value: 5 });

    expect(res.status).toBe(401);
  });

  it('returns 400 when value is out of range', async () => {
    const rating = await prisma.rating.create({ data: { userId, movieId, value: 2 } });

    const res = await request(app)
      .patch(`/ratings/${rating.id}`)
      .set(authHeader)
      .send({ value: 0 });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /ratings/:id', () => {
  it('returns 200 and removes the rating from the DB', async () => {
    const rating = await prisma.rating.create({ data: { userId, movieId, value: 3 } });

    const res = await request(app)
      .delete(`/ratings/${rating.id}`)
      .set(authHeader);

    expect(res.status).toBe(200);
    const deleted = await prisma.rating.findUnique({ where: { id: rating.id } });
    expect(deleted).toBeNull();
  });

  it('returns 401 without a token', async () => {
    const rating = await prisma.rating.create({ data: { userId, movieId, value: 3 } });

    const res = await request(app).delete(`/ratings/${rating.id}`);

    expect(res.status).toBe(401);
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).delete('/ratings/99999').set(authHeader);
    expect(res.status).toBe(404);
  });
});
