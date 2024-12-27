import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../utils/axios';

function Candidates() {
    const { jobId } = useParams(); // Получаем jobId из URL
    const [candidates, setCandidates] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [resume, setResume] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await apiClient.get(`/candidates/${jobId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCandidates(response.data);
            } catch (error) {
                console.error('Error fetching candidates:', error);
            }
        };

        fetchCandidates();
    }, [jobId]);

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await apiClient.post(
                '/candidates',
                { name, email, resume, vacancyId: jobId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCandidates([...candidates, response.data.candidate]);
            setName('');
            setEmail('');
            setResume('');
            setMessage('Candidate added successfully!');
        } catch (error) {
            console.error('Error adding candidate:', error);
            setMessage('Error adding candidate.');
        }
    };

    const handleDeleteCandidate = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await apiClient.delete(`/candidates/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCandidates(candidates.filter((candidate) => candidate.id !== id));
            setMessage('Candidate deleted successfully.');
        } catch (error) {
            console.error('Error deleting candidate:', error);
            setMessage('Error deleting candidate.');
        }
    };

    return (
        <div>
            <h1>Candidates</h1>
            {message && <p>{message}</p>}

            <h2>Add Candidate</h2>
            <form onSubmit={handleAddCandidate}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <textarea
                    placeholder="Resume"
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                />
                <button type="submit">Add Candidate</button>
            </form>

            <h2>List of Candidates</h2>
            <ul>
                {candidates.map((candidate) => (
                    <li key={candidate.id}>
                        <h3>{candidate.name}</h3>
                        <p>Email: {candidate.email}</p>
                        <p>Resume: {candidate.resume}</p>
                        <button onClick={() => handleDeleteCandidate(candidate.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Candidates;
