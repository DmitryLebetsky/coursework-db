const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async create(username, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, role]
    );
    return result.rows[0];
  },

  async findByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  },

  async getAll() {
    const result = await pool.query('SELECT id, username, role FROM users');
    return result.rows;
  },

  async getByRole(role) {
    const result = await pool.query('SELECT id, username, role FROM users WHERE role = $1', [role]);
    return result.rows;
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

};

module.exports = User;
