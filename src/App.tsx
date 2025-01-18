/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as TodoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { filteredTodos } from './servises/filterTodos';
import { FilterNav } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterTodos, setFilterTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [completedTodos, setCompletedTodos] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [filter, setFilter] = useState<FilterNav>('all');

  const hideError = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await TodoService.getTodos();

        setTodos(fetchedTodos);
      } catch (error) {
        setErrorMessage('Unable to load todos');

        hideError();
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    setFilterTodos(filteredTodos(todos, filter));

    const completeCount = todos.filter(todo => todo.completed).length;

    setCompletedTodos(completeCount);
  }, [todos, filter]);

  const handleFormSubmit = async (newTodoTitle: string): Promise<void> => {
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      hideError();

      return;
    }

    const createdTodo = {
      title: trimmedTitle,
      completed: false,
      userId: TodoService.USER_ID,
    };

    const newTempTodo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: TodoService.USER_ID,
    };

    setTempTodo(newTempTodo);

    try {
      const newTodo = await TodoService.createTodo(createdTodo);

      setTodos(currentTodos => [...currentTodos, newTodo]);

      setTempTodo(null);

      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setTempTodo(null);
      throw error;
    }
  };

  const deleteTodo = async (todoId: number): Promise<void> => {
    setErrorMessage('');

    try {
      await TodoService.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      throw error;
    }
  };

  const handleDeleteAllTodo = async (): Promise<void> => {
    setErrorMessage('');
    const filtredResult = filteredTodos(todos, 'completed');

    try {
      await Promise.all(filtredResult.map(todo => deleteTodo(todo.id)));
    } catch (error) {
      setErrorMessage('Unable to delete all todos');
      throw error;
    }
  };

  const handleErrorButton = () => {
    setErrorMessage('');
  };

  const handleFilter = (filterName: FilterNav) => {
    setFilter(filterName);
  };

  if (!TodoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <TodoHeader
        todos={filterTodos}
        onSubmit={handleFormSubmit}
        deleteTodo={deleteTodo}
        handleFilter={handleFilter}
        selectFilter={filter}
        totalItems={todos.length}
        completedTodos={completedTodos}
        tempTodo={tempTodo}
        handleDeleteAllTodo={handleDeleteAllTodo}
      />

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleErrorButton}
        />
        {errorMessage}
      </div>
    </div>
  );
};
