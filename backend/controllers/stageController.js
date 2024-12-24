const Stage = require('../models/Stage');
const CandidateStage = require('../models/CandidateStage');

const stageController = {
  async create(req, res) {
    const { name, jobId } = req.body;

    try {
      const stage = await Stage.create(name, jobId);
      res.status(201).json({ message: 'Stage created successfully', stage });
    } catch (error) {
      res.status(500).json({ message: 'Error creating stage', error });
    }
  },

  async update(req, res) {
    const { id } = req.params; // ID этапа из URL
    const { name } = req.body; // Новое имя этапа

    try {
      const updatedStage = await Stage.update(id, name);
      if (updatedStage) {
        res.json({ message: 'Stage updated successfully', updatedStage });
      } else {
        res.status(404).json({ message: 'Stage not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating stage', error });
    }
  },

  async getStagesAndCandidates(req, res) {
    const { jobId } = req.params;

    try {
      // Получаем этапы для вакансии
      const stages = await Stage.getAllByJob(jobId);

      // Получаем кандидатов на их текущих этапах для этой вакансии
      const candidates = await CandidateStage.getCandidatesByJob(jobId);

      res.json({ stages, candidates });
    } catch (error) {
      console.error('Error retrieving stages and candidates:', error);
      res.status(500).json({ message: 'Error retrieving data', error });
    }
  },

  async delete(req, res) {
    const { id } = req.params;

    try {
      // Получаем всех кандидатов с удаляемого этапа
      const candidates = await CandidateStage.getByStage(id);

      // Получаем вакансию для удаляемого этапа
      const stageToDelete = await Stage.getById(id);

      // Проверяем или создаём этап "No Stage"
      let noStage = await Stage.getByJobAndName(stageToDelete.job_id, 'No Stage');
      if (!noStage) {
        noStage = await Stage.create('No Stage', stageToDelete.job_id);
      }

      // Перемещаем кандидатов на этап "No Stage"
      const updatedCandidates = [];
      for (const candidate of candidates) {
        const updatedCandidate = await CandidateStage.update(candidate.candidate_id, noStage.id);
        updatedCandidates.push(updatedCandidate);
      }

      // Удаляем этап
      const deletedStage = await Stage.delete(id);

      res.json({
        message: 'Stage deleted successfully',
        deletedStage,
        noStage,
        updatedCandidates,
      });
    } catch (error) {
      console.error('Error deleting stage:', error);
      res.status(500).json({ message: 'Error deleting stage', error });
    }
  },

  async updateCandidateStage(req, res) {
    const { candidateId, stageId } = req.body;

    try {
      const updatedStage = await CandidateStage.updateStage(candidateId, stageId);
      res.json({ message: 'Candidate moved successfully', updatedStage });
    } catch (error) {
      console.error('Error updating candidate stage:', error);
      res.status(500).json({ message: 'Error updating candidate stage', error });
    }
  }

};

module.exports = stageController;
