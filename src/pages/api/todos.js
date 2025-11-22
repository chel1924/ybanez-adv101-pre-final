let todos = [];

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(todos);
  }

  if (req.method === "POST") {
    const { title, description } = req.body;

    const newTodo = {
      id: Date.now(),
      title,
      description,
      completed: false,
      date: new Date().toLocaleString(),
    };

    todos.push(newTodo);
    return res.status(201).json(newTodo);
  }

  if (req.method === "PUT") {
    const { id, title, description, completed } = req.body;

    todos = todos.map((t) =>
      t.id === id ? { ...t, title, description, completed } : t
    );

    return res.status(200).json({ message: "Updated" });
  }

  if (req.method === "DELETE") {
    const { id } = req.body;

    todos = todos.filter((t) => t.id !== id);

    return res.status(200).json({ message: "Deleted" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
