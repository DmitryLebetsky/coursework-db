const CandidateStage = require('../models/CandidateStage');

const candidateStageController = {
  async update(req, res) {
    const { candidateId, stageId } = req.body;

    try {
      const updatedCandidateStage = await CandidateStage.update(candidateId, stageId);
      res.status(200).json({ message: 'Candidate stage updated successfully', updatedCandidateStage });
    } catch (error) {
      res.status(500).json({ message: 'Error updating candidate stage', error });
    }
  },

  async getCurrentStages(req, res) {
    try {
      const currentStages = await CandidateStage.getCurrentStages();
      res.json(currentStages);
    } catch (error) {
      console.error('Error retrieving current stages:', error);
      res.status(500).json({ message: 'Error retrieving current stages', error });
    }
  },

  async getStatus(req, res) {
    const { candidateId } = req.params;

    try {
      const status = await CandidateStage.getByCandidate(candidateId);
      if (status) {
        res.json(status);
      } else {
        res.status(404).json({ message: 'Candidate stage not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving candidate stage', error });
    }
  },
};

module.exports = candidateStageController;
