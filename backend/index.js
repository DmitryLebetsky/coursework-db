const express = require('express');

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

require('dotenv').config();

const app = express();
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
