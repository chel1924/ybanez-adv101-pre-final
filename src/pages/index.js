"use client";
import { useState } from "react";

export default function Page() {
  return (
    <div className="min-h-screen bg-purple-700 flex justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8 border border-gray-200 text-black">
        <h1 className="text-4xl font-extrabold text-center mb-6 drop-shadow-lg">
          To-Do Manager
        </h1>
        <TodoApp />
      </div>
    </div>
  );
}

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const filtered = todos.filter((t) => {
    const matchesFilter = filter === "todos" ? !t.completed : t.completed;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const addTodo = () => {
    if (!form.title.trim()) return;
    setTodos([
      ...todos,
      {
        id: Date.now(),
        title: form.title,
        description: form.description,
        date: new Date().toLocaleString(),
        completed: false,
      },
    ]);
    setForm({ title: "", description: "" });
  };

  const updateTodo = () => {
    setTodos(
      todos.map((t) =>
        t.id === editingId
          ? { ...t, title: form.title, description: form.description, date: new Date().toLocaleString() }
          : t
      )
    );
    setEditingId(null);
    setForm({ title: "", description: "" });
  };

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id));
  const toggleComplete = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const startEdit = (todo) => setEditingId(todo.id) || setForm({ title: todo.title, description: todo.description });

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 text-black">
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 w-full shadow-sm focus:ring-2 focus:ring-teal-400 focus:outline-none"
        />
        <button
          onClick={editingId ? updateTodo : addTodo}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-700 transition font-semibold"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setFilter("todos")}
          className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
            filter === "todos"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          To-Do
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg font-semibold shadow transition ${
            filter === "completed"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Completed
        </button>
      </div>

      <table className="w-full border-collapse rounded-xl overflow-hidden shadow">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">ID</th>
            <th className="p-3">Title</th>
            <th className="p-3">Description</th>
            <th className="p-3">Date</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((todo) => (
            <tr key={todo.id} className="border-b hover:bg-gray-50 transition">
              <td className="p-3">{todo.id}</td>
              <td className="p-3">{todo.title}</td>
              <td className="p-3">{todo.description}</td>
              <td className="p-3">{todo.date}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => startEdit(todo)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg shadow hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => toggleComplete(todo.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg shadow hover:bg-green-700 transition"
                >
                  {todo.completed ? "Undo" : "Done"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 bg-gray-50 p-4 rounded-xl shadow-inner text-black">
        <h3 className="font-bold text-lg mb-2">{editingId ? "Edit Task" : "New Task"}</h3>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border rounded-lg p-2 w-full shadow-sm mb-3 focus:ring-2 focus:ring-teal-400"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded-lg p-2 w-full shadow-sm mb-3 h-24 focus:ring-2 focus:ring-teal-400"
        />
      </div>
    </div>
  );
}
