import { useContext } from 'react';
//Styles
import styles from './TodoDetail.module.scss';
//React Components
import Modal from './UI/Modal';
import { TodoContext } from '../store/TodoContextProvider';

////////////////////////////////////////////////////////////////////

const TodoDetail = () => {
  const { currentTodo, convertTimestamp, priorityColor } =
    useContext(TodoContext);

  return (
    <Modal>
      <div className={styles.content}>
        <p className="paragraph">
          <span className="bold">Title:</span> {currentTodo.title}
        </p>
        <p className="paragraph">
          <span className="bold">Due Date:</span>{' '}
          {convertTimestamp(currentTodo.dueDate)}
        </p>
        <p className="paragraph">
          <span className="bold">Details:</span> {currentTodo.details}
        </p>
        <span
          className={styles.priorityTag}
          style={{ backgroundColor: priorityColor(currentTodo.priority) }}
        >
          {currentTodo.priority}
        </span>
      </div>
    </Modal>
  );
};

export default TodoDetail;
