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
    data: { name: 'Reviewer', email: 'reviewer@example.com', password: 'hash' },
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
    data: { title: 'Reviewable Movie', synopsis: 'For review tests', releaseYear: new Date('2020-01-01') },
  });
  movieId = movie.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /reviews', () => {
  it('returns 201 with the created review', async () => {
    const res = await request(app)
      .post('/reviews')
      .set(authHeader)
      .send({ movieId, content: 'A great film with brilliant direction.' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('content', 'A great film with brilliant direction.');
    expect(res.body).toHaveProperty('movieId', movieId);
    expect(res.body).toHaveProperty('userId', userId);
  });

  it('returns 401 without a token', async () => {
    const res = await request(app)
      .post('/reviews')
      .send({ movieId, content: 'Great movie!' });

    expect(res.status).toBe(401);
  });

  it('returns 400 when content is too short', async () => {
    const res = await request(app)
      .post('/reviews')
      .set(authHeader)
      .send({ movieId, content: 'Hi' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when movieId is missing', async () => {
    const res = await request(app)
      .post('/reviews')
      .set(authHeader)
      .send({ content: 'No movie id provided here.' });

    expect(res.status).toBe(400);
  });
});

describe('GET /reviews', () => {
  beforeEach(async () => {
    await prisma.review.create({
      data: { userId, movieId, content: 'An excellent watch from start to finish.' },
    });
  });

  it('returns 200 with reviews for a movie', async () => {
    const res = await request(app)
      .get(`/reviews?movieId=${movieId}`)
      .set(authHeader);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('content', 'An excellent watch from start to finish.');
  });

  it('returns 400 when movieId is missing', async () => {
    const res = await request(app).get('/reviews').set(authHeader);
    expect(res.status).toBe(400);
  });
});

describe('PATCH /reviews/:id', () => {
  it('returns 200 with updated content', async () => {
    const review = await prisma.review.create({
      data: { userId, movieId, content: 'Original review content here.' },
    });

    const res = await request(app)
      .patch(`/reviews/${review.id}`)
      .set(authHeader)
      .send({ content: 'Updated review with more detail and insight.' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('content', 'Updated review with more detail and insight.');
  });

  it('returns 401 without a token', async () => {
    const review = await prisma.review.create({
      data: { userId, movieId, content: 'Original review content here.' },
    });

    const res = await request(app)
      .patch(`/reviews/${review.id}`)
      .send({ content: 'Unauthorized update attempt is happening.' });

    expect(res.status).toBe(401);
  });

  it('returns 400 when content is too short', async () => {
    const review = await prisma.review.create({
      data: { userId, movieId, content: 'Original review content here.' },
    });

    const res = await request(app)
      .patch(`/reviews/${review.id}`)
      .set(authHeader)
      .send({ content: 'Hi' });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /reviews/:id', () => {
  it('returns 200 and removes the review from the DB', async () => {
    const review = await prisma.review.create({
      data: { userId, movieId, content: 'Review to be deleted soon.' },
    });

    const res = await request(app)
      .delete(`/reviews/${review.id}`)
      .set(authHeader);

    expect(res.status).toBe(200);
    const deleted = await prisma.review.findUnique({ where: { id: review.id } });
    expect(deleted).toBeNull();
  });

  it('returns 401 without a token', async () => {
    const review = await prisma.review.create({
      data: { userId, movieId, content: 'Review to be deleted soon.' },
    });

    const res = await request(app).delete(`/reviews/${review.id}`);

    expect(res.status).toBe(401);
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).delete('/reviews/99999').set(authHeader);
    expect(res.status).toBe(404);
  });
});
