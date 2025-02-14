import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Home from './pages/Home';

const App: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <Routes>
      <Route path="/" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/home" 
        element={token ? <Home /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  );
};

export default App;