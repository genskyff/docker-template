import type { CreateTodoInput, PaginationParams, Todo, UpdateTodoInput } from './types';

const BASE_URL = '/api';

const toQuery = (params: PaginationParams = {}) => {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined);
  const search = new URLSearchParams(entries.map(([key, value]) => [key, String(value)]));
  return entries.length ? `?${search}` : '';
};

const request = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const headers = new Headers(options?.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.status === 204 ? (undefined as T) : response.json();
};

export const todoApi = {
  getTodos: (params?: PaginationParams) => request<Todo[]>(`/todos${toQuery(params)}`),

  createTodo: (input: CreateTodoInput) =>
    request<Todo>('/todos', { method: 'POST', body: JSON.stringify(input) }),

  updateTodo: (id: string, input: UpdateTodoInput) =>
    request<Todo>(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),

  deleteTodo: (id: string) => request<void>(`/todos/${id}`, { method: 'DELETE' }),
};
