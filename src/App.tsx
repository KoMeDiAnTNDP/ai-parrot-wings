// src/App.tsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import Home from './components/Home';
import { UserContext } from './UserContext';

const App: React.FC = () => {
  const { user } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/register" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
    </Routes>
  );
};

export default App;
