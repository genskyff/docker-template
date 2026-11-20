import { afterEach, beforeEach, describe, expect, rs, test } from '@rstest/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import type { Todo } from '@/api/todos';

import Todos from './Todos';

let todos: Todo[];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const respond = (url: string, init: RequestInit = {}) => {
  const body = typeof init.body === 'string' ? (JSON.parse(init.body) as Partial<Todo>) : {};
  if (init.method === 'POST') {
    const todo: Todo = { id: String(todos.length + 1), text: body.text ?? '', completed: false };
    todos = [...todos, todo];
    return json(todo, 201);
  }
  if (init.method === 'PATCH') {
    const id = url.split('/').at(-1);
    todos = todos.map((todo) => (todo.id === id ? { ...todo, ...body } : todo));
    return json(todos.find((todo) => todo.id === id));
  }
  return json(todos);
};

const renderTodos = () =>
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <Todos />
    </QueryClientProvider>,
  );

describe('Todos page', () => {
  beforeEach(() => {
    todos = [{ id: '1', text: 'Write docs', completed: false }];
    rs.stubGlobal(
      'fetch',
      rs.fn((url: string, init?: RequestInit) => Promise.resolve(respond(url, init))),
    );
  });
  afterEach(() => {
    rs.unstubAllGlobals();
  });

  test('adds a todo from the form', async () => {
    renderTodos();

    const input = screen.getByRole('textbox', { name: 'New todo' });
    fireEvent.change(input, { target: { value: 'Ship it' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByRole('checkbox', { name: 'Ship it' })).not.toBeChecked();
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  test('toggles a todo through its labelled checkbox', async () => {
    renderTodos();

    fireEvent.click(await screen.findByRole('checkbox', { name: 'Write docs' }));

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: 'Write docs' })).toBeChecked();
    });
  });
});
