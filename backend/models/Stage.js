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

  async update(id, name) {
    const result = await pool.query(
      'UPDATE stages SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    // Удаляем всех кандидатов с этого этапа
    await pool.query('DELETE FROM candidate_stage WHERE stage_id = $1', [id]);
  
    // Удаляем сам этап
    const result = await pool.query('DELETE FROM stages WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }  

};

module.exports = Stage;
