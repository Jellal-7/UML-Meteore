const request = require('supertest');

process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NODE_ENV = 'test';
process.env.DB_DIALECT = 'sqlite';

const app = require('../src/app');
const { sequelize } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/auth/register', () => {
  it('devrait créer un utilisateur et retourner un token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user.password_hash).toBeUndefined();
  });

  it('devrait refuser un email en doublon', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(409);
  });

  it('devrait refuser un email invalide', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        first_name: 'Test',
        last_name: 'User',
        email: 'invalid-email',
        password: 'password123',
      });

    expect(res.status).toBe(422);
  });
});

describe('POST /api/auth/login', () => {
  it('devrait retourner un token avec des identifiants corrects', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('devrait refuser des identifiants incorrects', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Email ou mot de passe incorrect');
  });
});

describe('GET /api/auth/me', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    token = res.body.token;
  });

  it('devrait retourner le profil avec un token valide', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('devrait refuser sans token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('devrait refuser un token invalide', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token');

    expect(res.status).toBe(401);
  });
});
