import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Icon & Styles
import {
  FcCloseUpMode,
  FcOpenedFolder,
  FcCalendar,
  FcTodoList,
} from 'react-icons/fc';
import { BsPlusLg, BsSortDownAlt } from 'react-icons/bs';
import { IoExitOutline } from 'react-icons/io5';
import styles from './TodoAppPage.module.scss';
//React Components
import TodoList from '../components/TodoList';
import AddTodoForm from '../components/AddTodoForm';
import TodoDetail from '../components/TodoDetail';
import { TodoContext } from '../store/TodoContextProvider';
//Firebase
import { auth } from '../store/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

////////////////////////////////////////////////////////////////////

const TodoAppPage = () => {
  const navigate = useNavigate();
  const [subpage, setSubpage] = useState('overview');
  const {
    modalIsShown,
    showModal,
    modal,
    setModal,
    setIsEditing,
    filterTodoList,
    sortTodoList,
    setUser,
    initialTodoList,
  } = useContext(TodoContext);

  //[UI] subPageClasses: 為目前 subpage 增加 active 樣式
  const subPageClasses = (subpageTitle) => {
    if (subpageTitle === subpage) {
      return `${styles.sidebar__listItem} active`;
    } else {
      return `${styles.sidebar__listItem}`;
    }
  };

  // DB : Sign out
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/');
        console.log('successfully log out!');
        setUser({});
        localStorage.removeItem('uid');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // DB: login, read data
  useEffect(() => {
    const removeListener = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          authName: user.displayName,
        };
        setUser(userData);
      }
    });
    return () => removeListener();
  }, []);

  useEffect(() => {
    filterTodoList(subpage);
  }, [initialTodoList]);

  return (
    <div className={styles.container}>
      {modal === 'form' && modalIsShown && <AddTodoForm />}
      {modal === 'detail' && modalIsShown && <TodoDetail />}
      <nav className={styles.nav}>
        <div className={styles.nav__logo}>
          <FcCloseUpMode />
          <span>Todo</span>
        </div>
        <button className={styles.btn__logout} onClick={handleSignOut}>
          <IoExitOutline />
          <span>Log out</span>
        </button>
      </nav>

      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <ul className={styles.sidebar__list}>
            <li
              className={subPageClasses('overview')}
              onClick={() => {
                setSubpage('overview');
                filterTodoList('overview');
              }}
            >
              <FcOpenedFolder className={styles.icon} />
              <span>overview</span>
            </li>
            <li
              className={subPageClasses('today')}
              onClick={() => {
                setSubpage('today');
                filterTodoList('today');
              }}
            >
              <FcTodoList className={styles.icon} />
              <span>today</span>
            </li>
            <li
              className={subPageClasses('week')}
              onClick={() => {
                setSubpage('week');
                filterTodoList('week');
              }}
            >
              <FcCalendar className={styles.icon} />
              <span>week</span>
            </li>
          </ul>
          <button
            className={`${styles.btn} btn-add`}
            onClick={() => {
              setIsEditing(false);
              setModal('form');
              showModal();
            }}
          >
            <BsPlusLg />
          </button>
        </aside>

        <section className={styles.section}>
          <div className={styles.section__title}>
            <h2 className="heading-2">{subpage}</h2>
            <button className={styles.btn__sort} onClick={sortTodoList}>
              <BsSortDownAlt />
            </button>
          </div>
          <TodoList subpage={subpage} />
        </section>
      </main>
    </div>
  );
};

export default TodoAppPage;
