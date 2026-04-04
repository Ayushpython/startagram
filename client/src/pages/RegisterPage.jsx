import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return <AuthForm type="register" />;
};

export default RegisterPage;
