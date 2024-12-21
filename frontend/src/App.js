import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateUser from './pages/CreateUser';

import { isAuthenticated } from './utils/auth';

function App() {

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
          path="/create-user"
          element={isAuthenticated() ? <CreateUser /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;