import { useContext, useState, useEffect } from 'react';
//Styles
import styles from './TodoList.module.scss';
//React Components
import { TodoContext } from '../store/TodoContextProvider';
import TodoItem from './TodoItem';

////////////////////////////////////////////////////////////////////

const TodoList = ({ subpage }) => {
  const [noTodo, setNoTodo] = useState('false');
  const { todoList } = useContext(TodoContext);

  useEffect(() => {
    if (todoList.length === 0) {
      setNoTodo(true);
    } else {
      setNoTodo(false);
    }
  }, [todoList]);

  const renderMessage = (subPage) => {
    switch (subPage) {
      case 'overview':
        return 'You do not have any task. Add some new Todos! 😀';
      case 'today':
        return 'You have nothing to do today. Have a nice day 🥳';
      case 'week':
        return 'You have nothing to do this week. Enjoy 😎';
    }
  };

  return (
    <div className={styles.list}>
      {noTodo && <p>{renderMessage(subpage)}</p>}
      {todoList.map((todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </div>
  );
};

export default TodoList;
