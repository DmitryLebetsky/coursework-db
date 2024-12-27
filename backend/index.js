const express = require('express');
const cors = require('cors'); // Подключаем CORS

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const candidateStageRoutes = require('./routes/candidateStageRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const stageRoutes = require('./routes/stageRoutes');
const jobTypeRoutes = require('./routes/jobTypeRoutes');
const actionLogRoutes = require('./routes/actionLogRoutes');
const candidateCommentRoutes = require('./routes/candidateCommentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json'); // Путь к сгенерированному файлу

require('dotenv').config();

const app = express();

// Подключаем CORS
app.use(cors({
  origin: 'http://humorous-generosity-production.up.railway.app', // Укажите ваш фронтенд-адрес
  credentials: true // Если используете куки или сессии
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/candidate-stage', candidateStageRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/stages', stageRoutes);
app.use('/api/job-types', jobTypeRoutes);
app.use('/api/action-log', actionLogRoutes);
app.use('/api/candidate-comments', candidateCommentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
}

module.exports = app;