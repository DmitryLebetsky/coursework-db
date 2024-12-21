const Job = require('../models/Job');
const ActionLog = require('../models/ActionLog'); 

const jobController = {
  async create(req, res) {
    const { title, description, jobTypeId } = req.body;
    const recruiterId = req.user.userId;
  
    try {
      const job = await Job.create(title, description, jobTypeId);
  
      // Пытаемся записать действие в лог
      try {
        await ActionLog.logAction(recruiterId, `Created job: ${job.title}`);
      } catch (logError) {
        console.error('Error logging action:', logError); // Логируем, но не прерываем процесс
      }
  
      res.status(201).json({ message: 'Job created successfully', job });
    } catch (error) {
      console.error('Error creating job:', error); // Логируем ошибку
      res.status(500).json({ message: 'Error creating job', error });
    }
  },  

  async getAll(req, res) {
    try {
      const jobs = await Job.getAll();
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving jobs', error });
    }
  },

  async getById(req, res) {
    const { id } = req.params;
    try {
      const job = await Job.getById(id);
      if (job) {
        res.json(job);
      } else {
        res.status(404).json({ message: 'Job not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving job', error });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
      const updatedJob = await Job.update(id, title, description);
      if (updatedJob) {
        res.json({ message: 'Job updated successfully', updatedJob });
      } else {
        res.status(404).json({ message: 'Job not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating job', error });
    }
  },

  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const job = await Job.updateStatus(id, status);
      if (job) {
        res.json({ message: 'Job status updated successfully', job });
      } else {
        res.status(404).json({ message: 'Job not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating job status', error });
    }
  },

  async delete(req, res) {
    const { id } = req.params;
    try {
      const job = await Job.delete(id);
      if (job) {
        res.json({ message: 'Job deleted successfully' });
      } else {
        res.status(404).json({ message: 'Job not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting job', error });
    }
  },
};

module.exports = jobController;
