import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props 
}) => {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
      disabled={loading || disabled}
      onClick={onClick}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
