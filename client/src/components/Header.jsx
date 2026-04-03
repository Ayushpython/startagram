import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Header.module.css';

const Header = () => {
  const { user, token, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Idea Marketplace
        </Link>

        <nav className={styles.nav}>
          <Link to="/marketplace">Marketplace</Link>
          {user && <Link to="/my-blueprints">My Blueprints</Link>}
          {user && <Link to="/wallet">Wallet</Link>}
        </nav>

        <div className={styles.auth}>
          {user ? (
            <>
              <span className={styles.username}>{user.firstName}</span>
              <button className={styles.logoutBtn} onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.link}>
                Login
              </Link>
              <Link to="/register" className={styles.linkBtn}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
