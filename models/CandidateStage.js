const pool = require('../config/db');

const CandidateStage = {
  async update(candidateId, stageId) {
    const result = await pool.query(
      'INSERT INTO candidate_stage (candidate_id, stage_id, updated_at) VALUES ($1, $2, NOW()) RETURNING *',
      [candidateId, stageId]
    );
    return result.rows[0];
  },

  async getByCandidate(candidateId) {
    const result = await pool.query(
      'SELECT cs.*, s.name AS stage_name FROM candidate_stage cs JOIN stages s ON cs.stage_id = s.id WHERE cs.candidate_id = $1 ORDER BY updated_at DESC LIMIT 1',
      [candidateId]
    );
    return result.rows[0];
  },
};

module.exports = CandidateStage;
