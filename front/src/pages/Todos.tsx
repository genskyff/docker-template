import { partition } from 'lodash-es';
import { Plus, Trash2 } from 'lucide-react';
import { type FC, type SubmitEvent, useState } from 'react';

import { type Todo, useCreateTodo, useDeleteTodo, useTodos, useUpdateTodo } from '@/api/todos';

const TodoItem: FC<{ todo: Todo }> = ({ todo }) => {
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  return (
    <li className="flex items-center gap-3 py-2">
      <label className="flex flex-1 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={todo.completed}
          disabled={updateTodo.isPending}
          onChange={() => updateTodo.mutate({ id: todo.id, input: { completed: !todo.completed } })}
        />
        <span className={todo.completed ? 'line-through opacity-50' : undefined}>{todo.text}</span>
      </label>
      <button
        type="button"
        className="btn btn-ghost btn-sm btn-square"
        aria-label="Delete"
        disabled={deleteTodo.isPending}
        onClick={() => deleteTodo.mutate(todo.id)}
      >
        <Trash2 size={16} />
      </button>
    </li>
  );
};

const Todos: FC = () => {
  const { data: todos = [], isPending, error, refetch, isFetching } = useTodos();
  const createTodo = useCreateTodo();
  const [draft, setDraft] = useState('');

  const [done, active] = partition(todos, (todo) => todo.completed);

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (text) {
      createTodo.mutate({ text }, { onSuccess: () => setDraft('') });
    }
  };

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <h2 className="card-title">
          Todos
          <span className="badge badge-neutral">
            {active.length} / {todos.length}
          </span>
        </h2>

        <form className="flex gap-2" onSubmit={submit}>
          <input
            type="text"
            className="input flex-1"
            placeholder="What needs to be done?"
            aria-label="New todo"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary btn-square"
            aria-label="Add"
            disabled={createTodo.isPending}
          >
            <Plus size={18} />
          </button>
        </form>

        {isPending ? (
          <span className="loading loading-spinner mx-auto my-6" />
        ) : error ? (
          <div role="alert" className="alert alert-error">
            <span className="flex-1">{error.message}</span>
            <button
              type="button"
              className="btn btn-sm"
              disabled={isFetching}
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        ) : (
          <ul className="divide-base-300 divide-y">
            {[...active, ...done].map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Todos;
