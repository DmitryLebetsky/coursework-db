const pool = require('../config/db');

const Stage = {
  async create(name, jobId) {
    const result = await pool.query(
      'INSERT INTO stages (name, job_id) VALUES ($1, $2) RETURNING *',
      [name, jobId]
    );
    return result.rows[0];
  },

  async getAllByJob(jobId) {
    const result = await pool.query('SELECT * FROM stages WHERE job_id = $1', [jobId]);
    return result.rows;
  },
};

module.exports = Stage;
