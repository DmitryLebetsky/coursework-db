import React, { useState, useEffect } from 'react';
import apiClient from '../utils/axios';

function JobTypes() {
  const [jobTypes, setJobTypes] = useState([]);
  const [typeName, setTypeName] = useState('');
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

    fetchJobTypes();
  }, []);

  const handleCreateJobType = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.post(
        '/job-types',
        { typeName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobTypes([...jobTypes, response.data.jobType]);
      setTypeName('');
      setMessage('Job type created successfully!');
    } catch (error) {
      console.error('Error creating job type:', error);
      setMessage('Error creating job type.');
    }
  };

  const handleDeleteJobType = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await apiClient.delete(`/job-types/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobTypes(jobTypes.filter((type) => type.id !== id));
      setMessage('Job type deleted successfully.');
    } catch (error) {
      console.error('Error deleting job type:', error);
      setMessage('Error deleting job type.');
    }
  };

  return (
    <div>
      <h1>Manage Job Types</h1>
      {message && <p>{message}</p>}

      <h2>Create Job Type</h2>
      <form onSubmit={handleCreateJobType}>
        <input
          type="text"
          placeholder="Job Type Name"
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>

      <h2>Existing Job Types</h2>
      <ul>
        {jobTypes.map((type) => (
          <li key={type.id}>
            {type.type_name}
            <button onClick={() => handleDeleteJobType(type.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobTypes;
