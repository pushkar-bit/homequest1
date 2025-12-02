import React from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AgentRoute = ({ children }) => {
  const isAuthenticated = authAPI.isAuthenticated();
  const user = authAPI.getCurrentUser();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user || user.role !== 'agent') return <Navigate to="/home" replace />;

  return children;
};

export default AgentRoute;
