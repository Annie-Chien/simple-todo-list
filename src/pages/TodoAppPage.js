import { useState, useContext, useEffect } from 'react';
//React Router
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
//Components
import TodoList from '../components/TodoList';
import AddTodoForm from '../components/AddTodoForm';
import TodoDetail from '../components/TodoDetail';
//Context
import { AuthContext } from '../store/AuthContextProvider';
import { TodoContext } from '../store/TodoContextProvider';

//===================================================//

const TodoAppPage = () => {
  const navigate = useNavigate();
  const { userSignOut } = useContext(AuthContext);
  const [subpage, setSubpage] = useState('overview');
  const {
    modalIsShown,
    showModal,
    modal,
    setModal,
    setIsEditing,
    filterTodoList,
    sortTodoList,
  } = useContext(TodoContext);
  const todoList = filterTodoList(subpage);

  //使用者登出
  const handleSignOut = () => {
    userSignOut()
      .then(() => {
        navigate('/');
        console.log('successfully log out!');
      })
      .catch((error) => console.log(error));
  };

  //[style] subPageClasses: 為目前 subpage 增加 active class
  const subPageClasses = (subpageTitle) => {
    return subpageTitle === subpage
      ? `${styles.sidebar__listItem} active`
      : `${styles.sidebar__listItem}`;
  };

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
          <TodoList subpage={subpage} todoList={todoList} />
        </section>
      </main>
    </div>
  );
};

export default TodoAppPage;
