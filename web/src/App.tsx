import { useState, type FC } from "react";
import {
  useTodos,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
  type Todo,
} from "./api/todos";

const App: FC = () => {
  const [newTodoText, setNewTodoText] = useState("");
  const { data: todos = [], isLoading, error } = useTodos();
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    createTodoMutation.mutate(
      { text: newTodoText },
      {
        onSuccess: () => {
          setNewTodoText("");
        },
      },
    );
  };

  const handleUpdateTodo = (id: string, completed: boolean) => {
    updateTodoMutation.mutate({ id, input: { completed } });
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodoMutation.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading todos</div>;

  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={handleCreateTodo}>
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Enter new todo"
          disabled={createTodoMutation.isPending}
        />
        <button type="submit" disabled={createTodoMutation.isPending}>
          {createTodoMutation.isPending ? "Adding..." : "Add Todo"}
        </button>
      </form>
      <ul>
        {todos.map((todo: Todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleUpdateTodo(todo.id, !todo.completed)}
            />
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
