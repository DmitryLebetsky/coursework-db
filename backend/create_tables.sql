CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE job_type (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    job_type_id INTEGER REFERENCES job_type(id),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    recruiter_id INTEGER REFERENCES users(id)
);

CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    resume TEXT,
    job_id INTEGER REFERENCES jobs(id)
);

CREATE TABLE stages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    job_id INTEGER REFERENCES jobs(id)
);

CREATE TABLE candidate_stage (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id),
    stage_id INTEGER REFERENCES stages(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE action_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidate_comment (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id),
    recruiter_id INTEGER REFERENCES users(id),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE report (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    job_id INTEGER REFERENCES jobs(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id), -- Кому адресовано уведомление
    message TEXT NOT NULL, -- Текст уведомления
    is_read BOOLEAN DEFAULT FALSE, -- Прочитано или нет
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Время создания
);


SELECT * FROM candidates;
SELECT * FROM candidate_stage;

INSERT INTO stages (name, job_id) VALUES ('Prescreening', 1), ('Interview', 1), ('Offer', 1);


CREATE OR REPLACE FUNCTION log_job_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO action_log (user_id, action, created_at)
  VALUES (
    NULL,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'Created job: ' || NEW.title
      WHEN TG_OP = 'UPDATE' THEN 'Updated job: ' || COALESCE(NEW.title, OLD.title)
      WHEN TG_OP = 'DELETE' THEN 'Deleted job: ' || OLD.title
      ELSE 'Unknown operation on job'
    END,
    CURRENT_TIMESTAMP
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_log_job
AFTER INSERT OR UPDATE OR DELETE ON jobs
FOR EACH ROW
EXECUTE FUNCTION log_job_action();

CREATE OR REPLACE FUNCTION log_candidate_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO action_log (user_id, action, created_at)
  VALUES (
    -- Здесь предполагается, что user_id будет извлекаться из внешнего контекста или оставлено NULL
    NULL, -- Для кандидатов user_id неизвестен, можно оставить NULL
    CASE
      WHEN TG_OP = 'INSERT' THEN 'Added candidate: ' || NEW.name || ' to job ID ' || NEW.job_id
      WHEN TG_OP = 'UPDATE' THEN 'Updated candidate: ' || COALESCE(NEW.name, OLD.name)
      WHEN TG_OP = 'DELETE' THEN 'Deleted candidate: ' || OLD.name || ' from job ID ' || OLD.job_id
      ELSE 'Unknown operation on candidate'
    END,
    CURRENT_TIMESTAMP
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_candidate
AFTER INSERT OR UPDATE OR DELETE ON candidates
FOR EACH ROW
EXECUTE FUNCTION log_candidate_action();

-- ИНДЕКСЫ
CREATE INDEX idx_candidates_job_id ON candidates (job_id);
CREATE INDEX idx_candidate_stage_candidate_id ON candidate_stage (candidate_id);
CREATE INDEX idx_candidate_stage_stage_id ON candidate_stage (stage_id);
CREATE INDEX idx_report_user_id ON report (user_id);
CREATE INDEX idx_report_job_id ON report (job_id);
CREATE INDEX idx_action_log_user_id ON action_log (user_id);
-- ПРЕДСТАВЛЕНИЯ
CREATE OR REPLACE VIEW job_summary AS
SELECT
    j.id AS job_id,
    j.title AS job_title,
    jt.type_name AS job_type,
    COUNT(c.id) AS candidate_count,
    j.status,
    j.created_at,
    j.closed_at
FROM jobs j
LEFT JOIN job_type jt ON j.job_type_id = jt.id
LEFT JOIN candidates c ON j.id = c.job_id
GROUP BY j.id, jt.type_name;

