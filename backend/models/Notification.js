const pool = require('../config/db');

const Notification = {
  async create(userId, message) {
    const result = await pool.query(
      'INSERT INTO notifications (user_id, message) VALUES ($1, $2) RETURNING *',
      [userId, message]
    );
    return result.rows[0];
  },

  async getByUser(userId) {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  },

  async markAsRead(notificationId) {
    const result = await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *',
      [notificationId]
    );
    return result.rows[0];
  },
};

module.exports = Notification;
