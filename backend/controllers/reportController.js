const Report = require('../models/Report');

const reportController = {
  async create(req, res) {
    const { jobId, content } = req.body;
    const userId = req.user.userId;

    try {
      const newReport = await Report.create(userId, jobId, content);
      res.status(201).json({ message: 'Report created successfully', newReport });
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({ message: 'Error creating report', error });
    }
  },

  async getAll(req, res) {
    try {
      const userId = req.user.userId;
      const userRole = req.user.role;

      let reports;

      if (userRole === 'admin') {
        // Администратор видит все отчёты
        reports = await Report.getAll();
      } else {
        // Рекрутер видит только свои
        reports = await Report.getByUser(userId);
      }

      res.json(reports);
    } catch (error) {
      console.error('Error retrieving reports:', error);
      res.status(500).json({ message: 'Error retrieving reports', error });
    }
  },
};

module.exports = reportController;
