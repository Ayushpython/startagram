import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import styles from './Auth.module.css';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.splitShell}>
        <section className={styles.heroPanel}>
          <div className={styles.brandBadge}>PulseHub</div>
          <h1>Welcome back. Sign in with your username and password.</h1>
          <p>
            Your account is stored in MongoDB. Enter the same username and password
            you used during registration to verify your credentials and continue.
          </p>

          <div className={styles.heroPoints}>
            <div>
              <strong>Fast access</strong>
              <span>Return to your feed in one click.</span>
            </div>
            <div>
              <strong>Stay connected</strong>
              <span>Pick up chats and notifications instantly.</span>
            </div>
            <div>
              <strong>Clean UI</strong>
              <span>Minimal, modern, and mobile-friendly.</span>
            </div>
          </div>
        </section>

        <section className={styles.formPanel}>
          <AuthForm type="login" />

          <p className={styles.helperText}>
            New here? <Link to="/register">Create an account</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
