const Analytics = require('../models/Analytics');

const analyticsController = {
  async getStageCounts(req, res) {
    const { jobId } = req.params;

    try {
      const counts = await Analytics.getStageCounts(jobId);
      res.json(counts);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving stage counts', error });
    }
  },

  async getAverageDurations(req, res) {
    const { jobId } = req.params;

    try {
      const durations = await Analytics.getAverageDurations(jobId);
      res.json(durations);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving average durations', error });
    }
  },

  async getConversionRates(req, res) {
    const { jobId } = req.params;

    try {
      const rates = await Analytics.getConversionRates(jobId);
      res.json(rates);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving conversion rates', error });
    }
  },
};

module.exports = analyticsController;
