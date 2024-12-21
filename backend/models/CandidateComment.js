const pool = require('../config/db');

const CandidateComment = {
  async create(candidateId, recruiterId, comment) {
    const result = await pool.query(
      'INSERT INTO candidate_comment (candidate_id, recruiter_id, comment) VALUES ($1, $2, $3) RETURNING *',
      [candidateId, recruiterId, comment]
    );
    return result.rows[0];
  },

  async getAllByCandidate(candidateId) {
    const result = await pool.query(
      'SELECT cc.*, u.username AS recruiter_name FROM candidate_comment cc JOIN users u ON cc.recruiter_id = u.id WHERE cc.candidate_id = $1 ORDER BY cc.created_at DESC',
      [candidateId]
    );
    return result.rows;
  },
};

module.exports = CandidateComment;
