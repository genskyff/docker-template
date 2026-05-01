export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface CreateTodoInput {
  text: string;
}

export interface UpdateTodoInput {
  text?: string;
  completed?: boolean;
}

export interface PaginationParams {
  offset?: number;
  limit?: number;
}
