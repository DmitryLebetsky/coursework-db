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
    vacancy_id INTEGER REFERENCES jobs(id)
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

SELECT * FROM candidates;
SELECT * FROM candidate_stage;

INSERT INTO stages (name, job_id) VALUES ('Prescreening', 1), ('Interview', 1), ('Offer', 1);