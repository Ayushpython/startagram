import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import styles from './Auth.module.css';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.splitShell}>
        <section className={styles.heroPanel}>
          <div className={styles.brandBadge}>PulseHub</div>
          <h1>Create your account and save your login details securely.</h1>
          <p>
            Register with a unique username, then sign in later using the same
            username and password to verify your identity.
          </p>

          <div className={styles.heroPoints}>
            <div>
              <strong>Unique username</strong>
              <span>Stored in MongoDB and checked on login.</span>
            </div>
            <div>
              <strong>Hashed password</strong>
              <span>Passwords are never saved in plain text.</span>
            </div>
            <div>
              <strong>Fast verification</strong>
              <span>We compare your login with the stored account record.</span>
            </div>
          </div>
        </section>

        <section className={styles.formPanel}>
          <AuthForm type="register" />

          <p className={styles.helperText}>
            Already have an account? <Link to="/login">Go to login</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
