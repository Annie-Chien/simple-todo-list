import { useState, createContext, useEffect, useContext } from 'react';
//Firebase
import { update, ref, onValue, set, remove } from 'firebase/database';
import { db } from './firebase.config';
//Context
import { AuthContext } from './AuthContextProvider';
//Utils
import { getWeekDates, convertTimestamp } from '../utils/utils';

//===================================================//

export const TodoContext = createContext();

//===================================================//

const TodoContextProvider = ({ children }) => {
  const [initialTodoList, setInitialTodoList] = useState([]); //完整 todoList
  const [currentTodo, setCurrentTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalIsShown, setModalIsShown] = useState(false);
  const [modal, setModal] = useState(); //確認是 detail or form modal
  const { user } = useContext(AuthContext);

  //Database: 寫入新資料
  const writeTodoData = (newTodo) => {
    set(ref(db, `todos/${user.uid}/${newTodo.id}`), {
      title: newTodo.title,
      checked: newTodo.checked,
      id: newTodo.id,
      details: newTodo.details,
      dueDate: newTodo.dueDate,
      priority: newTodo.priority,
    });
  };

  //Database: （登入時）讀取資料
  useEffect(() => {
    if (user.uid) {
      onValue(
        ref(db, `todos/${user.uid}`),
        (snapshot) => {
          setInitialTodoList([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).forEach((todo) => {
              setInitialTodoList((prev) => [...prev, todo]);
            });
          }
        },
        { onlyOnce: true }
      );
    }
  }, [user.uid]);

  ////////////////////////////////////////
  // Todo 的功能：增刪改
  ////////////////////////////////////////

  const addTodo = (newTodo) => {
    setInitialTodoList((prev) => [...prev, newTodo]);
    writeTodoData(newTodo); //DB: write
  };

  const deleteTodo = (id) => {
    const newTodoList = initialTodoList.filter((todo) => todo.id !== id);
    setInitialTodoList(newTodoList);

    //DB: remove
    remove(ref(db, `todos/${user.uid}/${id}`));
  };

  //更新
  const updateTodo = (editedTodo) => {
    const newTodoList = initialTodoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return editedTodo;
      }
      return todo;
    });
    setInitialTodoList(newTodoList);

    //DB: update
    const updates = {};
    updates[`todos/${user.uid}/${editedTodo.id}`] = editedTodo;
    update(ref(db), updates);
  };

  //toggleChecked(): todo 的 checkBox
  const toggleChecked = (id) => {
    const editedTodo = initialTodoList.find((todo) => todo.id === id);
    editedTodo.checked = !editedTodo.checked;

    //DB: update
    const updates = {};
    updates[`todos/${user.uid}/${id}`] = editedTodo;
    update(ref(db), updates);
  };

  //排序
  const sortTodoList = () => {
    const sortedTodoList = [...initialTodoList].sort(
      (todo, nextTodo) => todo.dueDate - nextTodo.dueDate
    );
    console.log('sorted!');
    setInitialTodoList(sortedTodoList);
  };

  ////////////////////////////////////////
  // UI 控制
  ////////////////////////////////////////

  const showModal = () => {
    setModalIsShown(true);
  };

  const closeModal = () => {
    setModalIsShown(false);
  };

  //決定priority tag 的顏色
  const priorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return '#c4d26c';
      case 'medium':
        return '#e7ca82';
      case 'high':
        return '#d26c6c';
      default:
        return 'white';
    }
  };

  const filterTodoList = (subpage) => {
    switch (subpage) {
      case 'overview':
        return initialTodoList;
      case 'today':
        const todayDate = new Date().toLocaleDateString();
        return initialTodoList.filter(
          (todo) => convertTimestamp(todo.dueDate) === todayDate
        );
      case 'week':
        const [start, end] = getWeekDates();
        return initialTodoList.filter(
          (todo) => todo.dueDate >= start && todo.dueDate <= end
        );
      default:
        return initialTodoList;
    }
  };

  return (
    <TodoContext.Provider
      value={{
        modalIsShown,
        modal,
        currentTodo,
        isEditing,
        user,
        initialTodoList,

        addTodo,
        closeModal,
        showModal,
        setModal,
        deleteTodo,
        setCurrentTodo,
        priorityColor,
        setIsEditing,
        updateTodo,
        filterTodoList,
        toggleChecked,
        sortTodoList,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export default TodoContextProvider;
