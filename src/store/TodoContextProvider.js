import { useState, createContext, useEffect } from 'react';
//Firebase
import { update, ref, onValue, set, remove } from 'firebase/database';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { db, auth } from './firebase';

////////////////////////////////////////////////////////////////////

export const TodoContext = createContext();

////////////////////////////////////////////////////////////////////

const TodoContextProvider = ({ children }) => {
  const [todoList, setTodoList] = useState([]); //呈現在畫面上的todolist
  const [initialTodoList, setInitialTodoList] = useState([]); //完整todoList
  const [currentTodo, setCurrentTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalIsShown, setModalIsShown] = useState(false);
  const [modal, setModal] = useState(); //確認是 detail or form modal
  const [user, setUser] = useState({ uid: localStorage.getItem('uid') }); //Firebase-Auth: 登入時的 user info

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const userData = {
          uid: result.user.uid,
          userName: result.user.displayName,
        };
        setUser(userData);
        localStorage.setItem('uid', user.uid);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const visitorSignIn = () => {
    const email = 'test123@test.com';
    const password = 'test123';
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        localStorage.setItem('uid', user.uid);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //DB: write
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

  //DB: read
  useEffect(() => {
    if (user.uid) {
      onValue(
        ref(db, `todos/${user.uid}`),
        (snapshot) => {
          setTodoList([]);
          setInitialTodoList([]);
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).forEach((todo) => {
              setTodoList((prev) => [...prev, todo]);
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

  //convertTimestamp(): convert timestamp to (yyyy-mm-d or dd)
  const convertTimestamp = (timeStamp) => {
    const date = new Date(timeStamp);
    return date.toLocaleDateString();
  };

  //計算當周日期期間
  const getWeekDates = () => {
    let now = new Date();
    let dayOfWeek = now.getDay(); // 0 - 6: Sun ~ Sat
    let todayDate = now.getDate(); //日期

    let start = new Date(now);
    start.setDate(todayDate - dayOfWeek + 1);
    start.setHours(0, 0, 0, 0);

    let end = new Date(now);
    end.setDate(todayDate + (7 - dayOfWeek));
    end.setHours(0, 0, 0, 0);

    return [start.valueOf(), end.valueOf()];
  };

  const filterTodoList = (subpage) => {
    let filteredList;

    switch (subpage) {
      case 'overview':
        filteredList = initialTodoList;
        break;
      case 'today':
        const todayDate = new Date().toLocaleDateString();
        filteredList = initialTodoList.filter(
          (todo) => convertTimestamp(todo.dueDate) === todayDate
        );
        break;
      case 'week':
        const [start, end] = getWeekDates();
        filteredList = initialTodoList.filter(
          (todo) => todo.dueDate >= start && todo.dueDate <= end
        );
        break;
      default:
        filteredList = initialTodoList;
    }

    setTodoList(filteredList);
  };

  //排序
  const sortTodoList = () => {
    const sortedTodoList = [...initialTodoList].sort(
      (todo, nextTodo) => todo.dueDate - nextTodo.dueDate
    );
    console.log('sorted!');
    setInitialTodoList(sortedTodoList);
  };

  //更新畫面
  useEffect(() => {
    setTodoList(initialTodoList);
  }, [initialTodoList]);

  return (
    <TodoContext.Provider
      value={{
        todoList,
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
        convertTimestamp,
        priorityColor,
        setIsEditing,
        updateTodo,
        filterTodoList,
        toggleChecked,
        sortTodoList,
        googleSignIn,
        setUser,
        visitorSignIn,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export default TodoContextProvider;
