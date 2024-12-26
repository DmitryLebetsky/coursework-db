const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });

const request = require('supertest');
const app = require('../backend/index.js');

let adminToken; // Токен администратора

beforeAll(async () => {
  // Логинимся как админ и получаем токен
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({
      username: 'admin',
      password: 'admin123'
    });
  expect(adminRes.statusCode).toEqual(200);
  expect(adminRes.body).toHaveProperty('token');
  adminToken = adminRes.body.token;
});

describe('Auth API', () => {
  let userId; // ID нового пользователя

  it('should create a user', async () => {
    const res = await request(app)
      .post('/api/auth/create')
      .set('authorization', `Bearer ${adminToken}`) // Используем токен администратора
      .send({
        username: 'lalala',
        password: 'password123',
        role: 'admin'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.user).toHaveProperty('id'); // Извлекаем ID из объекта user
    userId = res.body.user.id; // Сохраняем ID пользователя
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'lalala',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    authToken = res.body.token;
  });

  it('should delete the user', async () => {
    const res = await request(app)
      .delete(`/api/auth/${userId}`)
      .set('authorization', `Bearer ${adminToken}`); // Используем токен администратора
    expect(res.statusCode).toEqual(200);
  });
});

describe('Job API', () => {
  let jobId;

  it('should create a job', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Lalala',
        description: 'Develop and maintain software applications.',
        location: 'Remote',
        salary: 50000,
        type: 'Full-time'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.job).toHaveProperty('id');
    jobId = res.body.job.id;
  });

  it('should get job list', async () => {
    const res = await request(app)
      .get('/api/jobs')
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should update a job', async () => {
    const res = await request(app)
      .put(`/api/jobs/${jobId}`)
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Senior Software Developer',
        description: "updates test jest"
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.updatedJob).toHaveProperty('id', jobId);
    expect(res.body.updatedJob).toHaveProperty('title', 'Senior Software Developer');
    expect(res.body.updatedJob).toHaveProperty('description', 'updates test jest');
  });

  it('should delete a job', async () => {
    const res = await request(app)
      .delete(`/api/jobs/${jobId}`)
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });
});

describe('Candidate API', () => {
  let candidateId;

  it('should create a candidate', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        name: 'lalala',
        email: 'lalala@example.com',
        phone: '1234567890',
        resume: 'link_to_resume'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.candidate).toHaveProperty('candidate_id'); // Проверяем candidate_id вместо id
    candidateId = res.body.candidate.candidate_id; // Сохраняем candidate_id
  });

  it('should delete a candidate', async () => {
    const res = await request(app)
      .delete(`/api/candidates/${candidateId}`)
      .set('authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });
});
