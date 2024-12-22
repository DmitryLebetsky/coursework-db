import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navigation() {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
            <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
                <li>
                    <Link to="/">Dashboard</Link>
                </li>
                <li>
                    <Link to="/jobs">Jobs</Link>
                </li>
                <li>
                    <Link to="/job-types">Job Types</Link>
                </li>
                <li>
                    <Link to="/admin">Admin</Link>
                </li>
                <li>
                    <Link to="/action-logs">Action Logs</Link>
                </li>
                <li>
                    <Link to="/reports">Reports</Link>
                </li>
                <li>
                    <Link to="/notifications">Notifications</Link>
                </li>
                <li>
                    <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;
