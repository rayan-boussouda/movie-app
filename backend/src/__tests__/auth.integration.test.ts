import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import crypto from 'crypto';
import app from '../app';
import prisma from '../config/prisma';
import { redisClient } from '../config/redis';

beforeEach(async () => {
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();
  const keys = await redisClient.keys('rate-limit:*');
  if (keys.length > 0) await Promise.all(keys.map((k) => redisClient.del(k)));
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /auth/register', () => {
  it('returns 201 with user data excluding password', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', 'test@example.com');
    expect(res.body).not.toHaveProperty('password');
  });

  it('returns 409 when email is already registered', async () => {
    await prisma.user.create({
      data: { name: 'Existing', email: 'exists@example.com', password: 'hash' },
    });

    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'New User', email: 'exists@example.com', password: 'password123' });

    expect(res.status).toBe(409);
  });

  it('returns 400 with an invalid email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Test', email: 'not-an-email', password: 'password123' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when password is shorter than 6 characters', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Test', email: 'test@example.com', password: '123' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(400);
  });
});

describe('POST /auth/login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/auth/register')
      .send({ name: 'Login User', email: 'login@example.com', password: 'password123' });
  });

  it('returns 200 with a JWT token on valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'login@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('returns 401 on wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'login@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  it('returns 401 when the user does not exist', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });

    expect(res.status).toBe(401);
  });

  it('returns 400 on missing password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'login@example.com' });

    expect(res.status).toBe(400);
  });
});

describe('POST /auth/forgot-password', () => {
  it('returns 200 even when the email does not exist', async () => {
    const res = await request(app)
      .post('/auth/forgot-password')
      .send({ email: 'nobody@example.com' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});

describe('POST /auth/reset-password', () => {
  it('returns 400 for an invalid token', async () => {
    const res = await request(app)
      .post('/auth/reset-password')
      .send({ token: 'invalid-token-xyz', newPassword: 'newpassword123' });

    expect(res.status).toBe(400);
  });

  it('returns 200 and resets the password with a valid token', async () => {
    const user = await prisma.user.create({
      data: { name: 'Reset User', email: 'reset@example.com', password: 'oldhash' },
    });
    const rawToken = 'test-raw-token-abc123def456';
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    });

    const res = await request(app)
      .post('/auth/reset-password')
      .send({ token: rawToken, newPassword: 'newpassword123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 400 for an expired token', async () => {
    const user = await prisma.user.create({
      data: { name: 'Expired User', email: 'expired@example.com', password: 'oldhash' },
    });
    const rawToken = 'expired-token-abc123';
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() - 1000) },
    });

    const res = await request(app)
      .post('/auth/reset-password')
      .send({ token: rawToken, newPassword: 'newpassword123' });

    expect(res.status).toBe(400);
  });
});
