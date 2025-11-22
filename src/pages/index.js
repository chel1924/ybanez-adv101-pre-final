import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("todo");

  // Load Todos
  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  // Load once on page load (safe version)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTodos();
  }, []);

  // Add or Update Todo
  const handleSubmit = async () => {
    if (!title.trim()) return;

    if (editId) {
      await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          title,
          description,
        }),
      });

      setEditId(null);
    } else {
      await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
    }

    setTitle("");
    setDescription("");
    fetchTodos();
  };

  // Delete Todo
  const handleDelete = async (id) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchTodos();
  };

  // Mark done or undone
  const toggleComplete = async (todo) => {
    await fetch("/api/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...todo,
        completed: !todo.completed,
      }),
    });

    fetchTodos();
  };

  // Load values for editing
  const handleEdit = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setEditId(todo.id);
  };

  // Filter todos (search + tabs)
  const filteredTodos = todos.filter((t) => {
    const match = t.title.toLowerCase().includes(search.toLowerCase());
    if (tab === "todo") return !t.completed && match;
    if (tab === "completed") return t.completed && match;
  });

  return (
    <div style={{ padding: "30px" }}>
      <h1>To-Do App</h1>

      {/* Search */}
      <input
        placeholder="Search..."
        style={{ padding: "10px", width: "300px" }}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Tabs */}
      <div style={{ marginTop: 15 }}>
        <button onClick={() => setTab("todo")}>To Do</button>
        <button onClick={() => setTab("completed")}>Completed</button>
      </div>

      {/* Form */}
      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Title"
          style={{ padding: 10, marginRight: 10 }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Description"
          style={{ padding: 10, marginRight: 10 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* Todo List */}
      <table border="1" style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th><th>Title</th><th>Description</th>
            <th>Date</th><th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredTodos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.id}</td>
              <td>{todo.title}</td>
              <td>{todo.description}</td>
              <td>{todo.date}</td>

              <td>
                <button onClick={() => handleEdit(todo)}>Edit</button>
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
                <button onClick={() => toggleComplete(todo)}>
                  {todo.completed ? "Undo" : "Done"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
