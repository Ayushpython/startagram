import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css';

const AuthForm = ({ type = 'login' }) => {
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'both',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (type === 'login') {
        await login({ identifier: formData.username || formData.email, password: formData.password });
      } else {
        await register(formData);
      }
      navigate('/home');
    } catch (err) {
      console.error('FULL AUTH ERROR:', err);
      setError(err.error || err.message || 'Authentication failed');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{type === 'login' ? 'Login' : 'Register'}</h2>

      {error && <div className={styles.error}>{error}</div>}

      {type === 'register' && (
        <>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </>
      )}

      {type === 'login' ? (
        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          value={formData.username}
          onChange={handleChange}
          required
        />
      ) : (
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      )}

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      {type === 'register' && (
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="both">Creator & Builder</option>
          <option value="creator">Creator Only</option>
          <option value="builder">Builder Only</option>
        </select>
      )}

      <button type="submit" disabled={loading} className={styles.submitBtn}>
        {loading ? 'Loading...' : type === 'login' ? 'Login' : 'Register'}
      </button>
    </form>
  );
};

export default AuthForm;
