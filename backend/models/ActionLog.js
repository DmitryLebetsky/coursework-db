const pool = require('../config/db');

const ActionLog = {
    async logAction(userId, action) {
        try {
            const result = await pool.query(
                'INSERT INTO action_log (user_id, action) VALUES ($1, $2) RETURNING *',
                [userId, action]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error logging action:', error); // Логируем ошибку
            throw error; // Выбрасываем ошибку для отладки
        }
    },

    async getAll() {
        const result = await pool.query('SELECT * FROM action_log ORDER BY created_at DESC');
        return result.rows;
    },
};

module.exports = ActionLog;
