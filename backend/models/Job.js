const pool = require('../config/db');

const Job = {
  async create(title, description, jobTypeId) {
    const result = await pool.query(
      'INSERT INTO jobs (title, description, job_type_id, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, jobTypeId || null, 'open']
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query(`
      SELECT jobs.*, job_type.type_name AS job_type_name
      FROM jobs
      LEFT JOIN job_type ON jobs.job_type_id = job_type.id
      ORDER BY jobs.created_at DESC
    `);
    return result.rows;
  },  

  async getById(id) {
    const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id, title, description) {
    const result = await pool.query(
      'UPDATE jobs SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description, id]
    );
    return result.rows[0];
  },  

  async updateStatus(id, status) {
    const closedAt = status === 'closed' ? new Date() : null;
  
    const result = await pool.query(
      `UPDATE jobs 
       SET status = $1, closed_at = $2 
       WHERE id = $3 
       RETURNING *`,
      [status, closedAt, id]
    );
  
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Job;
