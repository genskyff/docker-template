import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { todoApi } from './todo';
import type { CreateTodoInput, PaginationParams, UpdateTodoInput } from './types';

/** Single source of truth for cache keys, so prefix matching stays reliable. */
export const todoKeys = {
  all: ['todos'] as const,
  list: (params?: PaginationParams) => [...todoKeys.all, params] as const,
};

const useInvalidateTodos = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: todoKeys.all });
};

/** Reusable for `useQuery`, `prefetchQuery` and typed `getQueryData` / `setQueryData`. */
export const todosQueryOptions = (params?: PaginationParams) =>
  queryOptions({
    queryKey: todoKeys.list(params),
    queryFn: () => todoApi.getTodos(params),
  });

export const useTodos = (params?: PaginationParams) => useQuery(todosQueryOptions(params));

export const useCreateTodo = () => {
  const invalidateTodos = useInvalidateTodos();
  return useMutation({
    mutationFn: (input: CreateTodoInput) => todoApi.createTodo(input),
    onSuccess: invalidateTodos,
  });
};

export const useUpdateTodo = () => {
  const invalidateTodos = useInvalidateTodos();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTodoInput }) =>
      todoApi.updateTodo(id, input),
    onSuccess: invalidateTodos,
  });
};

export const useDeleteTodo = () => {
  const invalidateTodos = useInvalidateTodos();
  return useMutation({
    mutationFn: (id: string) => todoApi.deleteTodo(id),
    onSuccess: invalidateTodos,
  });
};
