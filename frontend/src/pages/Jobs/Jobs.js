import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../utils/axios';
import './Jobs.css';

function Jobs() {
    const [jobTypes, setJobTypes] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [title, setTitle] = useState('');
    const [jobTypeId, setJobTypeId] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchJobTypes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await apiClient.get('/job-types', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setJobTypes(response.data);
            } catch (error) {
                console.error('Error fetching job types:', error);
            }
        };

        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await apiClient.get('/jobs', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("RESPONSE", response.data);
                setJobs(response.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs();
        fetchJobTypes();
    }, []);

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await apiClient.post(
                '/jobs',
                { title, description, jobTypeId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setJobs([...jobs, response.data.job]);
            setTitle('');
            setDescription('');
            setJobTypeId('');
            setMessage('Job created successfully!');
        } catch (error) {
            console.error('Error creating job:', error);
            setMessage('Error creating job.');
        }
    };

    const handleDeleteJob = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await apiClient.delete(`/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(jobs.filter((job) => job.id !== id));
            setMessage('Job deleted successfully.');
        } catch (error) {
            console.error('Error deleting job:', error);
            setMessage('Error deleting job.');
        }
    };

    const handleCloseJob = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await apiClient.put(
                `/jobs/${id}/status`,
                { status: 'closed' },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Обновляем список вакансий
            setJobs((prevJobs) =>
                prevJobs.map((job) =>
                    job.id === id ? { ...job, status: response.data.job.status } : job
                )
            );

            setMessage('Job closed successfully!');
        } catch (error) {
            console.error('Error closing job:', error);
            setMessage('Error closing job.');
        }
    };

    return (
        <div className="container">
            <h1>Jobs</h1>
            {message && <p>{message}</p>}

            <h2>Create Job</h2>
            <form className="job-form" onSubmit={handleCreateJob}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select
                    value={jobTypeId}
                    onChange={(e) => setJobTypeId(e.target.value)}
                >
                    <option value="">Select Job Type</option>
                    {jobTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.type_name}
                        </option>
                    ))}
                </select>
                <button type="submit">Create</button>
            </form>

            <h2>All Jobs</h2>
            <ul className='jobs-list'>
                {jobs.map((job) => (
                    <li className='job-card' key={job.id}>
                        <h3>{job.title}</h3>
                        <p>{job.description}</p>
                        <p>Type: {job.job_type_name || 'Not specified'}</p>
                        <p>Status: {job.status}</p>
                        <Link to={`/pipeline/${job.id}`}>View Pipeline</Link>
                        <button onClick={() => handleDeleteJob(job.id)}>Delete</button>
                        {job.status !== 'closed' && (
                            <button onClick={() => handleCloseJob(job.id)}>Close Job</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Jobs;
