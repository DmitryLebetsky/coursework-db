const pool = require('../config/db');

const CandidateStage = {
  async update(candidateId, stageId) {
    const result = await pool.query(
      'INSERT INTO candidate_stage (candidate_id, stage_id, updated_at) VALUES ($1, $2, NOW()) RETURNING *',
      [candidateId, stageId]
    );
    return result.rows[0];
  },

  async updateStage(candidateId, stageId) {
    const result = await pool.query(`
      UPDATE candidate_stage
      SET stage_id = $1, updated_at = NOW()
      WHERE candidate_id = $2
      RETURNING *
    `, [stageId, candidateId]);
    return result.rows[0];
  },

  async getByCandidate(candidateId) {
    const result = await pool.query(
      'SELECT cs.*, s.name AS stage_name FROM candidate_stage cs JOIN stages s ON cs.stage_id = s.id WHERE cs.candidate_id = $1 ORDER BY updated_at DESC LIMIT 1',
      [candidateId]
    );
    return result.rows[0];
  },

  async getCurrentStages() {
    const result = await pool.query(`
      SELECT DISTINCT ON (candidate_id) *
      FROM candidate_stage
      ORDER BY candidate_id, updated_at DESC
    `);
    return result.rows;
  },

  async getCandidatesByJob(jobId) {
    const result = await pool.query(`
      SELECT DISTINCT ON (cs.candidate_id) 
        cs.candidate_id, 
        cs.stage_id, 
        cs.updated_at, 
        c.name, 
        c.email, 
        c.resume, 
        cs.id AS candidate_stage_id
      FROM candidate_stage cs
      JOIN candidates c ON cs.candidate_id = c.id
      JOIN stages s ON cs.stage_id = s.id
      WHERE s.job_id = $1
      ORDER BY cs.candidate_id, cs.updated_at DESC
    `, [jobId]);

    return result.rows;
  },
};

module.exports = CandidateStage;
