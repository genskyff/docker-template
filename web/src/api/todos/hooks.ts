import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodoApi } from "./todo";
import type {
  CreateTodoInput,
  UpdateTodoInput,
  PaginationParams,
} from "./types";

const todoApi = createTodoApi();

export const useTodos = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ["todos", params],
    queryFn: () => todoApi.getTodos(params),
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTodoInput) => todoApi.createTodo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTodoInput }) =>
      todoApi.updateTodo(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => todoApi.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};
