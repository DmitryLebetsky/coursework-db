const pool = require('../config/db');

const JobType = {
  async create(typeName) {
    const result = await pool.query(
      'INSERT INTO job_type (type_name) VALUES ($1) RETURNING *',
      [typeName]
    );
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query('SELECT * FROM job_type');
    return result.rows;
  },

  async clearJobTypeReferences(id) {
    await pool.query(
      'UPDATE jobs SET job_type_id = NULL WHERE job_type_id = $1',
      [id]
    );
  },

  async delete(id) {
    // Сначала очищаем ссылки в таблице `jobs`
    await this.clearJobTypeReferences(id);
  
    // Затем удаляем тип вакансии
    const result = await pool.query(
      'DELETE FROM job_type WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
};

module.exports = JobType;
