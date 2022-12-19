import styles from './LoadingPage.module.scss';
//===================================================//
const LoadingPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default LoadingPage;
