import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoList } from '../TodoList/TodoList';
import { FilterNav } from '../../types/Filter';
import { TodoFooter } from '../TodoFooter/TodoFooter';
import { TodoCard } from '../TodoCard/TodoCard';

type Props = {
  todos: Todo[];
  onSubmit: (newTitle: string) => Promise<void>;
  deleteTodo: (todoId: number) => void;
  handleFilter: (filterName: FilterNav) => void;
  selectFilter: FilterNav;
  totalItems: number;
  completedTodos: number;
  tempTodo: Todo | null;
};

export const TodoHeader: React.FC<Props> = ({
  todos,
  onSubmit,
  deleteTodo,
  handleFilter,
  selectFilter,
  totalItems,
  completedTodos,
  tempTodo,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setNewTodoTitle('');
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(newTodoTitle).then(reset);
  };

  return (
    <div className="todoapp__content">
      <header className="todoapp__header">
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />

        <form onSubmit={handleFormSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTodoTitle}
            onChange={handleInputSubmit}
            ref={inputRef}
          />
        </form>
      </header>
      {todos.length !== 0 && <TodoList todos={todos} deleteTodo={deleteTodo} />}
      {tempTodo && <TodoCard todo={tempTodo} />}

      {totalItems !== 0 ? (
        <TodoFooter
          handleFilter={handleFilter}
          selectFilter={selectFilter}
          totalItems={totalItems}
          completedTodos={completedTodos}
        />
      ) : null}
    </div>
  );
};
