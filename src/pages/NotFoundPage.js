import React from 'react';
import styles from './NotFoundPage.module.scss';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className={styles.section}>
      <span>Oops!</span>
      <p>We can't find the page you're looking for :(</p>
      <Link to="/" className={styles.link}>
        Go Back
      </Link>
    </div>
  );
};

export default NotFoundPage;
