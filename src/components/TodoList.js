import { useState, useEffect } from 'react';
//Styles
import styles from './TodoList.module.scss';
// Components
import TodoItem from './TodoItem';

//==================================================//

const TodoList = ({ subpage, todoList }) => {
  // const [noTodo, setNoTodo] = useState(false);
  // console.log(todoList);
  // useEffect(() => {
  //   console.log(todoList);
  //   if (todoList.length === 0) {
  //     setNoTodo(true);
  //   } else {
  //     setNoTodo(false);
  //   }
  // }, [todoList]);

  const renderMessage = (subPage) => {
    switch (subPage) {
      case 'overview':
        return 'You do not have any task. Add some new Todos! 😀';
      case 'today':
        return 'You have nothing to do today. Have a nice day 🥳';
      case 'week':
        return 'You have nothing to do this week. Enjoy 😎';
      default:
        return 'You do not have any task. Add some new Todos! 😀';
    }
  };

  return (
    <div className={styles.list}>
      {todoList.length === 0 && <p>{renderMessage(subpage)}</p>}
      {todoList.map((todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </div>
  );
};

export default TodoList;
