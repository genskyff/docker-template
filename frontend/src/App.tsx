import { useState } from "react";
import axios from "axios";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:3000";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

const queryClient = new QueryClient();

const fetchTodos = async () => {
  const { data } = await axios.get<Todo[]>(`${API_BASE_URL}/todos`);
  return data;
};

const createTodo = async (text: string) => {
  const { data } = await axios.post<Todo>(`${API_BASE_URL}/todos`, { text });
  return data;
};

const deleteTodo = async (id: string) => {
  await axios.delete(`${API_BASE_URL}/todos/${id}`);
};

const updateTodo = async (todo: Todo) => {
  const { data } = await axios.patch<Todo>(`${API_BASE_URL}/todos/${todo.id}`, {
    text: todo.text,
    completed: todo.completed,
  });
  return data;
};

const TodosComponent = () => {
  const queryClient = useQueryClient();
  const { data: todos } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
  const addMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });
  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const [newTodo, setNewTodo] = useState("");
  const [editState, setEditState] = useState({ id: "", text: "" });

  const handleAddTodo = async () => {
    if (newTodo) {
      addMutation.mutate(newTodo);
      setNewTodo("");
    }
  };

  const startEditing = (todo: Todo) => {
    setEditState({ id: todo.id, text: todo.text });
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditState((prev) => ({ ...prev, text: event.target.value }));
  };

  const submitEdit = () => {
    if (editState.text) {
      const updatedTodo = todos?.find((todo) => todo.id === editState.id);
      if (updatedTodo) {
        updateMutation.mutate({ ...updatedTodo, text: editState.text });
        setEditState({ id: "", text: "" });
      }
    }
  };

  const toggleEditOrSave = (todo: Todo) => {
    if (editState.id === todo.id) {
      submitEdit();
    } else {
      startEditing(todo);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Enter new todo"
      />
      <button onClick={handleAddTodo}>Add Todo</button>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>
            {editState.id === todo.id ? (
              <input
                type="text"
                value={editState.text}
                onChange={handleEditChange}
                onBlur={submitEdit}
                autoFocus
              />
            ) : (
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.text}
              </span>
            )}
            <button
              onClick={() =>
                updateMutation.mutate({ ...todo, completed: !todo.completed })
              }
            >
              Done
            </button>
            <button onClick={() => deleteMutation.mutate(todo.id)}>
              Delete
            </button>
            <button onClick={() => toggleEditOrSave(todo)}>
              {editState.id === todo.id ? "Save" : "Edit"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TodosComponent />
    </QueryClientProvider>
  );
};

export default App;
