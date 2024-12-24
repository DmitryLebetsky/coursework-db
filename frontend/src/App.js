import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Jobs from './pages/Jobs/Jobs';
import JobTypes from './pages/JobTypes';
import Candidates from './pages/Candidates';
import Pipeline from './pages/Pipeline/Pipeline';
import ActionLogs from './pages/ActionLogs';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';

import Navigation from './components/Navigation';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, role } = useAuth();

  return (
    <Router>
      {isAuthenticated && <Navigation />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route
          path="/admin"
          element={isAuthenticated && role === 'admin' ? <Admin /> : <Navigate to="/login" />}
        />
        <Route
          path="/action-logs"
          element={isAuthenticated && role === 'admin' ? <ActionLogs /> : <Navigate to="/login" />}
        />
        <Route path="/jobs" element={isAuthenticated ? <Jobs /> : <Navigate to="/login" />} />
        <Route path="/job-types" element={isAuthenticated ? <JobTypes /> : <Navigate to="/login" />} />
        <Route
          path="/candidates/:jobId"
          element={isAuthenticated ? <Candidates /> : <Navigate to="/login" />}
        />
        <Route
          path="/pipeline/:jobId"
          element={isAuthenticated ? <Pipeline /> : <Navigate to="/login" />}
        />
        <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} />
        <Route
          path="/notifications"
          element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />}
        />

      </Routes>
    </Router>
  );
}

export default App;
