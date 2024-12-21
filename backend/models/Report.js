const pool = require('../config/db');

const Report = {
  async create(userId, jobId, content) {
    const result = await pool.query(
      'INSERT INTO report (user_id, job_id, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, jobId, content]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query('SELECT * FROM report ORDER BY created_at DESC');
    return result.rows;
  },
};

module.exports = Report;
