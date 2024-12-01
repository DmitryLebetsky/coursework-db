const Candidate = require('../models/Candidate');

const candidateController = {
  async create(req, res) {
    const { name, email, resume, vacancyId } = req.body;

    try {
      const candidate = await Candidate.create(name, email, resume, vacancyId);
      res.status(201).json({ message: 'Candidate added successfully', candidate });
    } catch (error) {
      res.status(500).json({ message: 'Error adding candidate', error });
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
    console.log('Candidate ID from params:', req.params.candidateId);
  
    try {
      const deletedCandidate = await Candidate.delete(req.params.candidateId);
      console.log('Deleted candidate:', deletedCandidate);
  
      if (deletedCandidate) {
        res.json({ message: 'Candidate deleted successfully', deletedCandidate });
      } else {
        res.status(404).json({ message: 'Candidate not found' });
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      res.status(500).json({ message: 'Error deleting candidate', error });
    }
  },
};

module.exports = candidateController;
