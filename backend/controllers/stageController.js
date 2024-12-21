const Stage = require('../models/Stage');

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

    async delete(req, res) {
        const { id } = req.params;
      
        try {
          const deletedStage = await Stage.delete(id);
          if (deletedStage) {
            res.json({ message: 'Stage deleted successfully', deletedStage });
          } else {
            res.status(404).json({ message: 'Stage not found' });
          }
        } catch (error) {
          res.status(500).json({ message: 'Error deleting stage', error });
        }
      }      

};

module.exports = stageController;
