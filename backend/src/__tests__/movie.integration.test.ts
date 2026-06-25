import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import prisma from '../config/prisma';

const adminToken = jwt.sign(
  { userId: 9001, role: 'ADMIN' },
  process.env.JWT_SECRET!,
  { expiresIn: '1h' },
);
const userToken = jwt.sign(
  { userId: 9002, role: 'USER' },
  process.env.JWT_SECRET!,
  { expiresIn: '1h' },
);
const adminAuth = { Authorization: `Bearer ${adminToken}` };
const userAuth = { Authorization: `Bearer ${userToken}` };

const sampleMovie = {
  title: 'Test Movie',
  synopsis: 'A great test movie synopsis',
  releaseYear: '2020-06-15',
};

beforeEach(async () => {
  await prisma.rating.deleteMany();
  await prisma.review.deleteMany();
  await prisma.userMovie.deleteMany();
  await prisma.movie.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /movies', () => {
  it('returns 201 when an ADMIN creates a movie', async () => {
    const res = await request(app).post('/movies').set(adminAuth).send(sampleMovie);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title', 'Test Movie');
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).post('/movies').send(sampleMovie);
    expect(res.status).toBe(401);
  });

  it('returns 403 for a non-admin user', async () => {
    const res = await request(app).post('/movies').set(userAuth).send(sampleMovie);
    expect(res.status).toBe(403);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/movies')
      .set(adminAuth)
      .send({ title: 'No synopsis' });

    expect(res.status).toBe(400);
  });
});

describe('GET /movies', () => {
  beforeEach(async () => {
    await prisma.movie.createMany({
      data: [
        { title: 'Alpha', synopsis: 'Synopsis A', releaseYear: new Date('2020-01-01') },
        { title: 'Beta', synopsis: 'Synopsis B', releaseYear: new Date('2021-01-01') },
      ],
    });
  });

  it('returns 200 with paginated movies', async () => {
    const res = await request(app).get('/movies').set(adminAuth);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('movies');
    expect(Array.isArray(res.body.movies)).toBe(true);
    expect(res.body).toHaveProperty('total', 2);
    expect(res.body).toHaveProperty('totalPages');
    expect(res.body).toHaveProperty('hasNext');
  });

  it('respects the limit query param', async () => {
    const res = await request(app).get('/movies?page=1&limit=1').set(adminAuth);

    expect(res.status).toBe(200);
    expect(res.body.movies).toHaveLength(1);
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).get('/movies');
    expect(res.status).toBe(401);
  });
});

describe('GET /movies/search', () => {
  beforeEach(async () => {
    await prisma.movie.create({
      data: { title: 'Inception', synopsis: 'Dream heist film', releaseYear: new Date('2010-07-16') },
    });
  });

  it('returns matching movies by title', async () => {
    const res = await request(app).get('/movies/search?title=Inception').set(adminAuth);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('title', 'Inception');
  });

  it('returns 400 when title query param is missing', async () => {
    const res = await request(app).get('/movies/search').set(adminAuth);
    expect(res.status).toBe(400);
  });
});

describe('GET /movies/:id', () => {
  it('returns 200 with the correct movie', async () => {
    const movie = await prisma.movie.create({
      data: { title: 'Solo', synopsis: 'Solo synopsis', releaseYear: new Date('2018-01-01') },
    });

    const res = await request(app).get(`/movies/${movie.id}`).set(adminAuth);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', movie.id);
    expect(res.body).toHaveProperty('title', 'Solo');
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).get('/movies/99999').set(adminAuth);
    expect(res.status).toBe(404);
  });
});

describe('PATCH /movies/:id', () => {
  it('returns 200 with the updated movie', async () => {
    const movie = await prisma.movie.create({
      data: { title: 'Old Title', synopsis: 'Synopsis', releaseYear: new Date('2020-01-01') },
    });

    const res = await request(app)
      .patch(`/movies/${movie.id}`)
      .set(adminAuth)
      .send({ title: 'New Title' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title', 'New Title');
  });

  it('returns 403 for a non-admin user', async () => {
    const movie = await prisma.movie.create({
      data: { title: 'Protected', synopsis: 'Synopsis', releaseYear: new Date('2020-01-01') },
    });

    const res = await request(app)
      .patch(`/movies/${movie.id}`)
      .set(userAuth)
      .send({ title: 'Hacked' });

    expect(res.status).toBe(403);
  });
});

describe('DELETE /movies/:id', () => {
  it('returns 200 and removes the movie from the DB', async () => {
    const movie = await prisma.movie.create({
      data: { title: 'Delete Me', synopsis: 'To be removed', releaseYear: new Date('2020-01-01') },
    });

    const res = await request(app).delete(`/movies/${movie.id}`).set(adminAuth);

    expect(res.status).toBe(200);
    const deleted = await prisma.movie.findUnique({ where: { id: movie.id } });
    expect(deleted).toBeNull();
  });

  it('returns 403 for a non-admin user', async () => {
    const movie = await prisma.movie.create({
      data: { title: 'Protected', synopsis: 'Synopsis', releaseYear: new Date('2020-01-01') },
    });

    const res = await request(app).delete(`/movies/${movie.id}`).set(userAuth);

    expect(res.status).toBe(403);
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).delete('/movies/99999').set(adminAuth);
    expect(res.status).toBe(404);
  });
});
