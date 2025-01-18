import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';

type Props = {
  todo: Todo;
  deleteTodo?: (todoId: number) => void;
};

export const TodoCard: React.FC<Props> = ({ todo, deleteTodo = () => { } }) => {
  const handleDelete = () => {
    deleteTodo(todo.id);
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
      {/* overlay will cover the todo while it is being deleted or updated */}
      {todo.id === 0 ? <TodoLoader /> : null}
    </div>
  );
};
