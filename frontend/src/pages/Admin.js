import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [recruiters, setRecruiters] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Получение списка рекрутеров
  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/auth/recruiters', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecruiters(response.data);
      } catch (error) {
        console.error('Error fetching recruiters:', error);
      }
    };

    fetchRecruiters();
  }, []);

  // Создание рекрутера
  const handleCreateRecruiter = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/auth/create',
        { username, password, role: 'recruiter' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecruiters([...recruiters, response.data.user]);
      setMessage(`User ${response.data.user.username} created successfully!`);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Error creating recruiter:', error);
      setMessage('Error creating recruiter.');
    }
  };

  // Удаление рекрутера
  const handleDeleteRecruiter = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/auth/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecruiters(recruiters.filter((recruiter) => recruiter.id !== id));
      setMessage('Recruiter deleted successfully.');
    } catch (error) {
      console.error('Error deleting recruiter:', error);
      setMessage('Error deleting recruiter.');
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {message && <p>{message}</p>}

      <h2>Create Recruiter</h2>
      <form onSubmit={handleCreateRecruiter}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>

      <h2>Recruiters</h2>
      <ul>
        {recruiters.map((recruiter) => (
          <li key={recruiter.id}>
            {recruiter.username} ({recruiter.role})
            <button onClick={() => handleDeleteRecruiter(recruiter.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
