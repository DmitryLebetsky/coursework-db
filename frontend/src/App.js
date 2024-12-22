import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Jobs from './pages/Jobs';
import JobTypes from './pages/JobTypes';
import Candidates from './pages/Candidates';
import Pipeline from './pages/Pipeline';

import { isAuthenticated, isAdmin } from './utils/auth';

function App() {

  useEffect(() => {
    // Проверяем токен при загрузке приложения
    if (!isAuthenticated()) {
      localStorage.removeItem('token'); // Удаляем просроченный токен
    }
  }, []);

  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />

        {/* Защищённый маршрут: перенаправление на /login, если пользователь не авторизован */}
        <Route
          path="/"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={isAuthenticated() && isAdmin() ? <Admin /> : <Navigate to="/login" />}
        />
        <Route
          path="/jobs"
          element={isAuthenticated() ? <Jobs /> : <Navigate to="/login" />}
        />
        <Route
          path="/job-types"
          element={isAuthenticated() ? <JobTypes /> : <Navigate to="/login" />}
        />
        <Route
          path="/candidates/:jobId"
          element={isAuthenticated() ? <Candidates /> : <Navigate to="/login" />}
        />
        <Route
          path="/pipeline/:jobId"
          element={isAuthenticated() ? <Pipeline /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;