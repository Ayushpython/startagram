import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Home.module.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className={styles.hero}>
      <div className={styles.container}>
        <h1>Buy, sell, and co-build startup blueprints.</h1>
        <p className={styles.lead}>
          Access complete validated startup plans with problem statements, market research, features, and monetization strategies. Save time. Build faster.
        </p>

        <div className={styles.cta}>
          {user ? (
            <Link to="/marketplace" className={styles.btnPrimary}>
              Browse Blueprints
            </Link>
          ) : (
            <>
              <Link to="/register" className={styles.btnPrimary}>
                Get Started
              </Link>
              <Link to="/login" className={styles.btnSecondary}>
                Login
              </Link>
            </>
          )}
        </div>

        <div className={styles.stats}>
          <div>
            <div className={styles.statNumber}>2,400+</div>
            <div className={styles.statLabel}>Blueprints</div>
          </div>
          <div>
            <div className={styles.statNumber}>1,200+</div>
            <div className={styles.statLabel}>Active Users</div>
          </div>
          <div>
            <div className={styles.statNumber}>$500k+</div>
            <div className={styles.statLabel}>Payouts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
