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
    data: { name: 'Watcher', email: 'watcher@example.com', password: 'hash' },
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
    data: { title: 'Watchable Movie', synopsis: 'For list tests', releaseYear: new Date('2020-01-01') },
  });
  movieId = movie.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /user-movies', () => {
  it('returns 201 when a movie is added to the list', async () => {
    const res = await request(app)
      .post('/user-movies')
      .set(authHeader)
      .send({ movieId, status: 'WATCHLIST' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('movieId', movieId);
    expect(res.body).toHaveProperty('userId', userId);
    expect(res.body).toHaveProperty('status', 'WATCHLIST');
  });

  it('returns 401 without a token', async () => {
    const res = await request(app)
      .post('/user-movies')
      .send({ movieId, status: 'WATCHLIST' });

    expect(res.status).toBe(401);
  });

  it('returns 400 when status is invalid', async () => {
    const res = await request(app)
      .post('/user-movies')
      .set(authHeader)
      .send({ movieId, status: 'INVALID_STATUS' });

    expect(res.status).toBe(400);
  });

  it('returns 409 when the same movie+status already exists', async () => {
    await prisma.userMovie.create({ data: { userId, movieId, status: 'WATCHLIST' } });

    const res = await request(app)
      .post('/user-movies')
      .set(authHeader)
      .send({ movieId, status: 'WATCHLIST' });

    expect(res.status).toBe(409);
  });
});

describe('GET /user-movies', () => {
  beforeEach(async () => {
    await prisma.userMovie.createMany({
      data: [
        { userId, movieId, status: 'WATCHLIST' },
        { userId, movieId, status: 'FAVORITE' },
      ],
    });
  });

  it('returns 200 with all movies in the list', async () => {
    const res = await request(app).get('/user-movies').set(authHeader);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });

  it('filters by status', async () => {
    const res = await request(app)
      .get('/user-movies?status=WATCHLIST')
      .set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('status', 'WATCHLIST');
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).get('/user-movies');
    expect(res.status).toBe(401);
  });
});

describe('PATCH /user-movies/:id', () => {
  it('returns 200 with the updated status', async () => {
    const entry = await prisma.userMovie.create({
      data: { userId, movieId, status: 'WATCHLIST' },
    });

    const res = await request(app)
      .patch(`/user-movies/${entry.id}`)
      .set(authHeader)
      .send({ status: 'WATCHED' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'WATCHED');
  });

  it('returns 401 without a token', async () => {
    const entry = await prisma.userMovie.create({
      data: { userId, movieId, status: 'WATCHLIST' },
    });

    const res = await request(app)
      .patch(`/user-movies/${entry.id}`)
      .send({ status: 'WATCHED' });

    expect(res.status).toBe(401);
  });

  it('returns 400 when status is invalid', async () => {
    const entry = await prisma.userMovie.create({
      data: { userId, movieId, status: 'WATCHLIST' },
    });

    const res = await request(app)
      .patch(`/user-movies/${entry.id}`)
      .set(authHeader)
      .send({ status: 'BAD_STATUS' });

    expect(res.status).toBe(400);
  });
});

describe('DELETE /user-movies/:id', () => {
  it('returns 200 and removes the entry from the DB', async () => {
    const entry = await prisma.userMovie.create({
      data: { userId, movieId, status: 'WATCHED' },
    });

    const res = await request(app)
      .delete(`/user-movies/${entry.id}`)
      .set(authHeader);

    expect(res.status).toBe(200);
    const deleted = await prisma.userMovie.findUnique({ where: { id: entry.id } });
    expect(deleted).toBeNull();
  });

  it('returns 401 without a token', async () => {
    const entry = await prisma.userMovie.create({
      data: { userId, movieId, status: 'WATCHED' },
    });

    const res = await request(app).delete(`/user-movies/${entry.id}`);

    expect(res.status).toBe(401);
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).delete('/user-movies/99999').set(authHeader);
    expect(res.status).toBe(404);
  });
});
