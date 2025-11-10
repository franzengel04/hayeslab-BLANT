import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <h2 style={styles.subtitle}>Page Not Found</h2>
      <p style={styles.message}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" style={styles.link}>
        Return to Home
      </Link>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '6rem',
    color: '#507DCD',
    margin: '0',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '2rem',
    color: '#333',
    margin: '10px 0',
  },
  message: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '30px',
  },
  link: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#507DCD',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
    transition: 'background-color 0.2s',
  },
};

export default NotFound;
