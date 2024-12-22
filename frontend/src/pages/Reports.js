import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Reports() {
  const [reports, setReports] = useState([]);
  const [content, setContent] = useState('');
  const [jobId, setJobId] = useState('');
  const [message, setMessage] = useState('');
  const [jobs, setJobs] = useState([]); // Список вакансий

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/reports', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setMessage('Error fetching reports.');
      }
    };

    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchReports();
    fetchJobs();
  }, []);

  const handleCreateReport = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/reports',
        { jobId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports([response.data.newReport, ...reports]);
      setContent('');
      setJobId('');
      setMessage('Report created successfully!');
    } catch (error) {
      console.error('Error creating report:', error);
      setMessage('Error creating report.');
    }
  };

  return (
    <div>
      <h1>Reports</h1>
      {message && <p>{message}</p>}

      <h2>Create Report</h2>
      <form onSubmit={handleCreateReport}>
        <select value={jobId} onChange={(e) => setJobId(e.target.value)} required>
          <option value="">Select Job</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Write your report here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="5"
        ></textarea>
        <button type="submit">Create Report</button>
      </form>

      <h2>All Reports</h2>
      <ul>
        {reports.map((report) => (
          <li key={report.id}>
            <p>Report ID: {report.id}</p>
            <p>Job ID: {report.job_id}</p>
            <p>Created By: User ID {report.user_id}</p>
            <p>Content: {report.content}</p>
            <p>Created At: {new Date(report.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reports;
