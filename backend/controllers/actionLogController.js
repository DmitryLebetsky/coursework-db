const ActionLog = require('../models/ActionLog');

const actionLogController = {
  async getAll(req, res) {
    try {
      const logs = await ActionLog.getAll();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving action log', error });
    }
  },
};

module.exports = actionLogController;
