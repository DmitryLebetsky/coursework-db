const Job = require('../models/Job');
const Notification = require('../models/Notification');
const User = require('../models/User');

const jobController = {
  async create(req, res) {
    const { title, description, jobTypeId } = req.body;

    try {
      const job = await Job.create(title, description, jobTypeId);

      const users = await User.getAll(); // Получаем всех пользователей

      // Создаём уведомления для всех рекрутеров
      for (const user of users) {
        await Notification.create(user.id, `New job created: ${job.title}`);
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
