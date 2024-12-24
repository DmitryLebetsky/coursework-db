const Candidate = require('../models/Candidate');
const CandidateStage = require('../models/CandidateStage');
const Stage = require('../models/Stage');

const candidateController = {
  async create(req, res) {
    const { name, email, resume, vacancyId } = req.body;

    try {
      // Получаем этапы для вакансии
      let stages = await Stage.getAllByJob(vacancyId);

      let targetStage;
      if (stages.length === 0) {
        targetStage = await Stage.create('No Stage', vacancyId);
      } else {
        targetStage = stages[0];
      }

      // Создаём кандидата
      const candidate = await Candidate.create(name, email, resume, vacancyId);

      // Добавляем кандидата на целевой этап
      const enrichedCandidate = await CandidateStage.update(candidate.id, targetStage.id);

      res.status(201).json({ message: 'Candidate added successfully', candidate: enrichedCandidate });
    } catch (error) {
      console.error('Error adding candidate:', error);
      res.status(500).json({ message: 'Error adding candidate', error });
    }
  },

  async getAll(req, res) {
    try {
      const candidates = await Candidate.getAll();
      res.json(candidates);
    } catch (error) {
      console.error('Error retrieving candidates:', error);
      res.status(500).json({ message: 'Error retrieving candidates', error });
    }
  },

  async getAllByVacancy(req, res) {
    const { vacancyId } = req.params;

    try {
      const candidates = await Candidate.getAllByVacancy(vacancyId);
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving candidates', error });
    }
  },

  // Удаление кандидата из этапов
  async removeFromStage(req, res) {
    const { candidateId } = req.params;

    try {
      const removedStages = await Candidate.removeFromStage(candidateId);
      if (removedStages.length > 0) {
        res.json({ message: 'Candidate removed from all stages', removedStages });
      } else {
        res.status(404).json({ message: 'Candidate not found on any stage' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error removing candidate from stage', error });
    }
  },

  // Полное удаление кандидата из вакансии
  async delete(req, res) {
    const { candidateId } = req.params;

    try {
      // Удаляем связь кандидата с этапами
      await CandidateStage.removeFromCandidate(candidateId);

      // Удаляем самого кандидата
      const deletedCandidate = await Candidate.delete(candidateId);

      if (!deletedCandidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }

      res.json({ message: 'Candidate deleted successfully', deletedCandidate });
    } catch (error) {
      console.error('Error deleting candidate:', error);
      res.status(500).json({ message: 'Error deleting candidate', error });
    }
  },

};

module.exports = candidateController;
