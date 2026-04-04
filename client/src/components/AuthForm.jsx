import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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

  const inputClasses = "w-full bg-black border border-white/20 p-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors font-mono text-sm";

  return (
    <div className="w-full max-w-md mx-auto pt-32 pb-24 px-6 min-h-[calc(100vh-80px)] flex flex-col justify-center">
      <div className="mb-10">
        <h2 className="text-4xl font-black uppercase text-white mb-2">
          {type === 'login' ? 'Welcome Back' : 'Join Us'}
        </h2>
        <p className="font-mono text-sm text-primary uppercase tracking-widest">
          {type === 'login' ? 'Login to continue /' : 'Register your account /'}
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 font-mono text-sm uppercase tracking-wide">
            {error}
          </div>
        )}

        {type === 'register' && (
          <div className="space-y-6">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className={inputClasses}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={inputClasses}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
          </div>
        )}

        {type === 'login' ? (
          <input
            type="text"
            name="username"
            placeholder="Username or Email"
            value={formData.username}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        ) : (
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className={inputClasses}
        />

        {type === 'register' && (
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
            className={`${inputClasses} appearance-none cursor-pointer`}
          >
            <option value="both">Role: Creator & Builder</option>
            <option value="creator">Role: Creator Only</option>
            <option value="builder">Role: Builder Only</option>
          </select>
        )}

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-5 bg-primary hover:bg-white text-black font-bold uppercase tracking-widest transition-colors shadow-glow mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : type === 'login' ? 'Login to Portal' : 'Create Account'}
        </button>
      </form>
      
      <div className="mt-8 text-center">
        {type === 'login' ? (
          <Link to="/register" className="font-mono text-sm text-gray-500 hover:text-white transition-colors">
            DON'T HAVE AN ACCOUNT? REGISTER
          </Link>
        ) : (
          <Link to="/login" className="font-mono text-sm text-gray-500 hover:text-white transition-colors">
            ALREADY HAVE AN ACCOUNT? LOGIN
          </Link>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
