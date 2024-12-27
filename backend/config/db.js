const { Pool } = require('pg');

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,  // Используем DATABASE_URL
    ssl: {
      rejectUnauthorized: false, // Это для использования SSL
    },
  });

// Проверка подключения при запуске
pool.connect((err, client, release) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.stack);
    } else {
        console.log('Успешное подключение к базе данных');
    }
    release();
});

module.exports = pool;
