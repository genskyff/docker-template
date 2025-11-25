import {
  type Todo,
  type CreateTodoInput,
  type UpdateTodoInput,
  type PaginationParams,
} from "./types";

const createApi = (baseURL: string = "/api") => {
  const request = async <T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> => {
    const url = `${baseURL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // For delete requests or empty responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  };

  return {
    getTodos: async (params?: PaginationParams): Promise<Todo[]> => {
      const searchParams = new URLSearchParams();
      if (params?.offset !== undefined) {
        searchParams.append("offset", params.offset.toString());
      }
      if (params?.limit !== undefined) {
        searchParams.append("limit", params.limit.toString());
      }
      const queryString = searchParams.toString()
        ? "?" + searchParams.toString()
        : "";
      return request<Todo[]>(`/todos${queryString}`);
    },

    createTodo: async (input: CreateTodoInput): Promise<Todo> => {
      return request<Todo>("/todos", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },

    updateTodo: async (id: string, input: UpdateTodoInput): Promise<Todo> => {
      return request<Todo>(`/todos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      });
    },

    deleteTodo: async (id: string): Promise<void> => {
      await request<void>(`/todos/${id}`, {
        method: "DELETE",
      });
    },
  };
};

export const createTodoApi = (baseURL?: string) => createApi(baseURL);

export type TodoApi = ReturnType<typeof createTodoApi>;
