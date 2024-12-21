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
      const reports = await Report.getAll();
      res.json(reports);
    } catch (error) {
      console.error('Error retrieving reports:', error);
      res.status(500).json({ message: 'Error retrieving reports', error });
    }
  },
};

module.exports = reportController;