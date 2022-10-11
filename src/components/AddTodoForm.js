import { useState, useContext, useEffect, useRef } from 'react';
//Icon & Styles
import { BsPlusLg } from 'react-icons/bs';
import styles from './AddTodoForm.module.scss';
//React Compenents
import { TodoContext } from '../store/TodoContextProvider';
import Modal from './UI/Modal';

////////////////////////////////////////////////////////////////////

const AddTodoForm = () => {
  const [alertIsShown, setAlertIsShown] = useState(false);
  const [priority, setPriority] = useState('low');

  const titleRef = useRef();
  const detailRef = useRef();
  const dueDateRef = useRef();

  const {
    addTodo,
    closeModal,
    currentTodo,
    isEditing,
    setIsEditing,
    convertTimestamp,
    priorityColor,
    updateTodo,
  } = useContext(TodoContext);

  //changePriorityBtnColor: 改變 priority tag 的顏色
  const changePriorityBtnColor = (tag) => {
    if (tag === priority) return priorityColor(tag);
  };

  const handleClickPriority = (e) => {
    if (!e.target.matches('button')) return;
    setPriority(e.target.textContent);
  };

  //formateDate(): convert (yyyy/mm/d or dd) to (yyyy-mm-dd)
  const formateDate = (dateWithSlash) => {
    return dateWithSlash
      .split('/')
      .map((str) => str.padStart(2, '0'))
      .join('-');
  };

  //表單時間：限制只能選擇今天之後的日期、defaultValue 一併設定為今日日期（放在哪裡比較好?
  const todayDateWithSlash = new Date().toLocaleDateString();
  const todayDate = formateDate(todayDateWithSlash);

  //checkTitleIsNotEmpty: check if the title input is empty or not
  const checkTitleIsNotEmpty = () => {
    if (titleRef.current.value === '') {
      setAlertIsShown(true); //show alert
      return false;
    } else {
      setAlertIsShown(false);
      return true;
    }
  };

  //handleEditTodo: 新增 Todo
  const handleAddTodo = () => {
    if (!checkTitleIsNotEmpty()) return; //if title is empty, then show alert and do nothing

    const uniqueId = new Date().getTime(); //generate a unique ID
    const newTodo = {
      id: uniqueId,
      checked: false,
      title: titleRef.current.value,
      dueDate: dueDateRef.current.valueAsNumber,
      priority: priority,
      details: detailRef.current.value,
    };

    addTodo(newTodo);
    closeModal();
  };

  //handleEditTodo: 編輯Todo
  const handleEditTodo = () => {
    if (!checkTitleIsNotEmpty()) return; //if title is empty, then show alert and do nothing

    const editedTodo = {
      id: currentTodo.id,
      title: titleRef.current.value,
      dueDate: dueDateRef.current.valueAsNumber,
      details: detailRef.current.value,
      checked: currentTodo.checked,
      priority,
    };

    updateTodo(editedTodo);
    closeModal();
  };

  const handleClick = () => {
    if (isEditing) {
      handleEditTodo();
    } else {
      handleAddTodo();
    }
    setIsEditing(false);
  };

  // alert (提醒使用者title不得為空）跳出的時間
  useEffect(() => {
    const timer = setTimeout(() => {
      setAlertIsShown(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [alertIsShown]);

  //在 editing 模式下，先預先設定 priority
  useEffect(() => {
    if (isEditing) setPriority(currentTodo.priority);
  }, []);

  return (
    <Modal>
      {alertIsShown && <p className={styles.alert}>Title is required!</p>}
      <div className={styles.content}>
        <input
          type="text"
          placeholder="title"
          className={styles.titleInput}
          ref={titleRef}
          required
          defaultValue={isEditing ? currentTodo.title : null}
        />
        <textarea
          placeholder="detail"
          className={styles.detailInput}
          rows="8"
          ref={detailRef}
          defaultValue={isEditing ? currentTodo.details : null}
        />
        <div className={styles.formGroup}>
          <label htmlFor="dueDate">Due Date: </label>
          <input
            type="date"
            id="dueDate"
            className={styles.dateInput}
            defaultValue={
              isEditing
                ? formateDate(convertTimestamp(currentTodo.dueDate))
                : todayDate
            }
            ref={dueDateRef}
            min={todayDate}
          />
        </div>
        <div className={styles.container} onClick={handleClickPriority}>
          <span>Priority: </span>
          <button
            className={styles.btn}
            style={{
              backgroundColor: changePriorityBtnColor('low'),
            }}
          >
            low
          </button>
          <button
            className={styles.btn}
            style={{
              backgroundColor: changePriorityBtnColor('medium'),
            }}
          >
            medium
          </button>
          <button
            className={styles.btn}
            style={{
              backgroundColor: changePriorityBtnColor('high'),
            }}
          >
            high
          </button>
        </div>
      </div>
      <button className={`${styles.float} btn-add`} onClick={handleClick}>
        <BsPlusLg />
      </button>
    </Modal>
  );
};

export default AddTodoForm;
