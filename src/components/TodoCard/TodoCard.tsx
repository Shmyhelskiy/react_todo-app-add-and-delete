import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';

type Props = {
  todo: Todo;
  deleteTodo?: (todoId: number) => void;
};

export const TodoCard: React.FC<Props> = ({ todo, deleteTodo = () => {} }) => {
  const [isActiveLoader, setisActiveLoader] = useState(false);

  const handleDelete = async () => {
    setisActiveLoader(true);
    try {
      await deleteTodo?.(todo.id);
    } finally {
      setisActiveLoader(false);
    }
  };

  return (
    <div data-cy="Todo" className={todo.completed ? 'todo completed' : 'todo'}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      {todo.id === 0 ? (
        <TodoLoader isActiveLoader={true} />
      ) : (
        <TodoLoader isActiveLoader={isActiveLoader} />
      )}
    </div>
  );
};
