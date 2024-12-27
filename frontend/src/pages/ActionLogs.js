import React, { useState, useEffect } from 'react';
import apiClient from '../utils/axios';

const ActionLogs = () => {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await apiClient.get('/action-log', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLogs(response.data);
            } catch (err) {
                console.error('Error fetching logs:', err);
                setError('Failed to fetch action logs. Please try again.');
            }
        };

        fetchLogs();
    }, []);

    return (
        <div>
            <h1>Action Logs</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px' }}>User ID</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Action</th>
                        <th style={{ border: '1px solid black', padding: '8px' }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{log.user_id}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{log.action}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(log.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ActionLogs;
