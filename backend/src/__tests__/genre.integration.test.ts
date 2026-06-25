import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import prisma from '../config/prisma';

const adminToken = jwt.sign(
  { userId: 1, role: 'ADMIN' },
  process.env.JWT_SECRET!,
  { expiresIn: '1h' },
);
const auth = { Authorization: `Bearer ${adminToken}` };

beforeEach(async () => {
  await prisma.genre.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /genres', () => {
  it('returns 200 with an array of genres', async () => {
    await prisma.genre.createMany({ data: [{ name: 'Action' }, { name: 'Drama' }] });

    const res = await request(app).get('/genres');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
  });

  it('returns an empty array when no genres exist', async () => {
    const res = await request(app).get('/genres');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /genres', () => {
  it('returns 201 with the created genre', async () => {
    const res = await request(app)
      .post('/genres')
      .set(auth)
      .send({ name: 'Sci-Fi' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Sci-Fi' });
    expect(res.body).toHaveProperty('id');
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).post('/genres').send({ name: 'Sci-Fi' });
    expect(res.status).toBe(401);
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/genres').set(auth).send({});
    expect(res.status).toBe(400);
  });
});

describe('GET /genres/:id', () => {
  it('returns 200 with the correct genre', async () => {
    const genre = await prisma.genre.create({ data: { name: 'Horror' } });

    const res = await request(app).get(`/genres/${genre.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: genre.id, name: 'Horror' });
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).get('/genres/99999');
    expect(res.status).toBe(404);
  });
});

describe('PATCH /genres/:id', () => {
  it('returns 200 with updated values', async () => {
    const genre = await prisma.genre.create({ data: { name: 'Romance' } });

    const res = await request(app)
      .patch(`/genres/${genre.id}`)
      .set(auth)
      .send({ name: 'Romance Updated' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: genre.id, name: 'Romance Updated' });
  });

  it('returns 401 without a token', async () => {
    const genre = await prisma.genre.create({ data: { name: 'Romance' } });
    const res = await request(app).patch(`/genres/${genre.id}`).send({ name: 'X' });
    expect(res.status).toBe(401);
  });
});

describe('DELETE /genres/:id', () => {
  it('returns 200 and the genre no longer exists in the DB', async () => {
    const genre = await prisma.genre.create({ data: { name: 'Thriller' } });

    const res = await request(app).delete(`/genres/${genre.id}`).set(auth);

    expect(res.status).toBe(200);
    const deleted = await prisma.genre.findUnique({ where: { id: genre.id } });
    expect(deleted).toBeNull();
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).delete('/genres/99999').set(auth);
    expect(res.status).toBe(404);
  });
});
