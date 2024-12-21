const CandidateComment = require('../models/CandidateComment');

const candidateCommentController = {
  async create(req, res) {
    const { candidateId, comment } = req.body;
    const recruiterId = req.user.userId;

    try {
      const newComment = await CandidateComment.create(candidateId, recruiterId, comment);
      res.status(201).json({ message: 'Comment added successfully', newComment });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ message: 'Error adding comment', error });
    }
  },

  async getAllByCandidate(req, res) {
    const { candidateId } = req.params;

    try {
      const comments = await CandidateComment.getAllByCandidate(candidateId);
      res.json(comments);
    } catch (error) {
      console.error('Error retrieving comments:', error);
      res.status(500).json({ message: 'Error retrieving comments', error });
    }
  },
};

module.exports = candidateCommentController;
