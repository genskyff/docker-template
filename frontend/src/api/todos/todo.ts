import axios, { AxiosInstance } from "axios";
import {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  PaginationParams,
} from "./types";

const createApi = (baseURL: string = "http://localhost:8333"): AxiosInstance =>
  axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const createTodoApi = (baseURL?: string) => {
  const api = createApi(baseURL);

  return {
    getTodos: async (params?: PaginationParams): Promise<Todo[]> => {
      const response = await api.get<Todo[]>("/todos", { params });
      return response.data;
    },

    createTodo: async (input: CreateTodoInput): Promise<Todo> => {
      const response = await api.post<Todo>("/todos", input);
      return response.data;
    },

    updateTodo: async (id: string, input: UpdateTodoInput): Promise<Todo> => {
      const response = await api.patch<Todo>(`/todos/${id}`, input);
      return response.data;
    },

    deleteTodo: async (id: string): Promise<void> => {
      await api.delete(`/todos/${id}`);
    },
  };
};

export type TodoApi = ReturnType<typeof createTodoApi>;
