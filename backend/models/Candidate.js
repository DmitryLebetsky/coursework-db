const pool = require('../config/db');

const Candidate = {
  async create(name, email, resume, vacancyId) {
    const result = await pool.query(
      'INSERT INTO candidates (name, email, resume, vacancy_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, resume, vacancyId]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query('SELECT * FROM candidates');
    return result.rows;
  },

  async getAllByVacancy(vacancyId) {
    const result = await pool.query(
      'SELECT * FROM candidates WHERE vacancy_id = $1',
      [vacancyId]
    );
    return result.rows;
  },

  // Удаление кандидата из этапов
  async removeFromStage(candidateId) {
    const result = await pool.query(
      'DELETE FROM candidate_stage WHERE candidate_id = $1 RETURNING *',
      [candidateId]
    );
    return result.rows;
  },

  // Полное удаление кандидата из вакансии
  async delete(candidateId) {
    console.log('Deleting candidate with ID:', candidateId);
    await pool.query('DELETE FROM candidate_stage WHERE candidate_id = $1', [candidateId]); // Удаляем записи из candidate_stage
    const result = await pool.query(
      'DELETE FROM candidates WHERE id = $1 RETURNING *',
      [candidateId]
    );
    console.log('Delete result:', result.rows);
    return result.rows[0];
  },
};

module.exports = Candidate;
