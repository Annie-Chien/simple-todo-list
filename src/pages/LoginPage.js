import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Image & Icon & Styles
import loginImg from '../img/loginPage_img.svg';
import loginBgImg from '../img/loginPage_imgBg.png';
import googleIcon from '../img/google-icon.png';
import { FaUserCircle } from 'react-icons/fa';
import styles from './LoginPage.module.scss';
// React Components
import { TodoContext } from '../store/TodoContextProvider';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, googleSignIn, visitorSignIn } = useContext(TodoContext);

  useEffect(() => {
    console.log(user);
    if (user.uid) {
      navigate('/todos');
    }
  }, [user]);

  return (
    <div className={styles.background}>
      <div className={styles.card}>
        <section className={styles.card__left}>
          <div className={styles.card__title}>
            <h1 className="heading-1">Todo List App</h1>
            <p className="paragraph italic">Simple yet Powerful</p>
          </div>
          <div className={styles.img__container}>
            <img
              src={loginBgImg}
              alt="login background"
              className={styles.bgImg}
            />
            <img src={loginImg} alt="login " className={styles.img} />
          </div>
        </section>
        <section className={styles.card__right}>
          <p className={styles.login__greeting}>Welcome!</p>
          <button className={styles.login__btn} onClick={googleSignIn}>
            <img
              src={googleIcon}
              alt="google icon"
              className={styles.googleIcon}
            />
            Sign in with Google
          </button>
          <div className={styles.option}>or</div>
          <button className={styles.login__btn} onClick={visitorSignIn}>
            <FaUserCircle className={styles.icon} /> Demo Version
          </button>
        </section>
      </div>
      <footer className={styles.footer}>
        <span>Made by Annie Chien 🌼 </span>
        <a target="_blank" href="https://icons8.com/icon/V5cGWnc9R4xj/google">
          Google
        </a>{' '}
        icon by{' '}
        <a target="_blank" href="https://icons8.com">
          Icons8
        </a>
      </footer>
    </div>
  );
};

export default LoginPage;
