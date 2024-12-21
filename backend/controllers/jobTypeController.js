const JobType = require('../models/JobType');

const jobTypeController = {
  async create(req, res) {
    const { typeName } = req.body;

    try {
      const jobType = await JobType.create(typeName);
      res.status(201).json({ message: 'Job type created successfully', jobType });
    } catch (error) {
      res.status(500).json({ message: 'Error creating job type', error });
    }
  },

  async getAll(req, res) {
    try {
      const jobTypes = await JobType.getAll();
      res.json(jobTypes);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving job types', error });
    }
  },

  async delete(req, res) {
    const { id } = req.params;
  
    try {
      const deletedJobType = await JobType.delete(id);
      if (deletedJobType) {
        res.json({ message: 'Job type deleted successfully', deletedJobType });
      } else {
        res.status(404).json({ message: 'Job type not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting job type', error });
    }
  },
};

module.exports = jobTypeController;
