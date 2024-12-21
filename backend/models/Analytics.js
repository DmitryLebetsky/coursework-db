const pool = require('../config/db');

const Analytics = {
  async getStageCounts(jobId) {
    const result = await pool.query(
      `SELECT s.name AS stage_name, COUNT(cs.id) AS candidate_count
       FROM stages s
       LEFT JOIN candidate_stage cs ON s.id = cs.stage_id
       WHERE s.job_id = $1
       GROUP BY s.name`,
      [jobId]
    );
    return result.rows;
  },

  async getAverageDurations(jobId) {
    const result = await pool.query(
      `WITH candidate_durations AS (
         SELECT 
           cs.candidate_id,
           s.name AS stage_name,
           EXTRACT(EPOCH FROM (cs.updated_at - LAG(cs.updated_at) OVER (PARTITION BY cs.candidate_id ORDER BY cs.updated_at))) AS duration
         FROM candidate_stage cs
         JOIN stages s ON cs.stage_id = s.id
         WHERE s.job_id = $1
       )
       SELECT 
         stage_name,
         AVG(duration) AS avg_duration
       FROM candidate_durations
       GROUP BY stage_name`,
      [jobId]
    );
    return result.rows;
  },

  async getConversionRates(jobId) {
    const result = await pool.query(
      `WITH stage_counts AS (
         SELECT s.id AS stage_id, COUNT(cs.id) AS candidate_count
         FROM stages s
         LEFT JOIN candidate_stage cs ON s.id = cs.stage_id
         WHERE s.job_id = $1
         GROUP BY s.id
       )
       SELECT s.name AS stage_name,
              COALESCE((sc_next.candidate_count::NUMERIC / NULLIF(sc.candidate_count, 0)), 0) AS conversion_rate
       FROM stage_counts sc
       LEFT JOIN stage_counts sc_next ON sc.stage_id = (sc_next.stage_id - 1)
       JOIN stages s ON s.id = sc.stage_id
       WHERE s.job_id = $1
       ORDER BY s.id`,
      [jobId]
    );
    return result.rows;
  },

  async getAverageClosingTime() {
    const result = await pool.query(
      `SELECT AVG(EXTRACT(EPOCH FROM (j.closed_at - j.created_at))) AS avg_closing_time
       FROM jobs j
       WHERE j.status = 'closed'`
    );
    return result.rows[0];
  }
  
};

module.exports = Analytics;
