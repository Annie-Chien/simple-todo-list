import { useContext } from 'react';
//Icon & Styles
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import styles from './TodoItem.module.scss';
//React Componenets
import { TodoContext } from '../store/TodoContextProvider';

////////////////////////////////////////////////////////////////////

const TodoItem = ({ todo }) => {
  const { id, title, checked, priority, dueDate } = todo;

  const {
    setModal,
    showModal,
    deleteTodo,
    setCurrentTodo,
    convertTimestamp,
    priorityColor,
    setIsEditing,
    toggleChecked,
  } = useContext(TodoContext);

  return (
    <div className={styles.todoItem} onClick={() => setCurrentTodo(todo)}>
      <div
        className={styles.priorityTag}
        style={{ backgroundColor: priorityColor(priority) }}
      ></div>
      <label className={styles.checkboxContainer}>
        <input
          type="checkbox"
          className={styles.checkbox}
          defaultChecked={checked}
          onClick={() => toggleChecked(id)}
        />
        <span className={styles.checkmark}></span>
      </label>
      <p className={`${styles.title} paragraph`}>{title}</p>
      <span className={styles.time}>{convertTimestamp(dueDate)}</span>
      <button
        className={`${styles.detailBtn} btn`}
        onClick={() => {
          setModal('detail');
          showModal();
        }}
      >
        Details
      </button>

      <button
        className={styles.editBtn}
        onClick={() => {
          setIsEditing(true);
          setModal('form');
          showModal();
        }}
      >
        <FiEdit3 />
      </button>
      <button className={styles.deleteBtn} onClick={() => deleteTodo(id)}>
        <FiTrash2 />
      </button>
    </div>
  );
};

export default TodoItem;
