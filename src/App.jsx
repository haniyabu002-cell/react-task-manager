import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") {
      return;
    }

    const newTask = {
      id: Date.now(),
      text: task,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };

    setTasks([...tasks, newTask]);
    setTask("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditingText(item.text);
  };

  const saveEdit = (id) => {
    if (editingText.trim() === "") {
      return;
    }

    setTasks(
      tasks.map((item) =>
        item.id === id
          ? { ...item, text: editingText }
          : item
      )
    );

    setEditingId(null);
    setEditingText("");
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <div className="task-container">

        <h1>Task Manager</h1>

        <button
          className="theme-button"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <p>Manage your daily tasks easily.</p>

        <div className="task-stats">
          <span>Total: {tasks.length}</span>

          <span>
            Completed:{" "}
            {tasks.filter((item) => item.completed).length}
          </span>
        </div>

        <div className="task-input">
          <input
            type="text"
            placeholder="Enter your task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
          />

          <button onClick={addTask}>Add Task</button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active-filter" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={filter === "active" ? "active-filter" : ""}
            onClick={() => setFilter("active")}
          >
            Active
          </button>

          <button
            className={filter === "completed" ? "active-filter" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        <div className="task-list">

          {tasks
            .filter((item) =>
              item.text
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .filter((item) => {
              if (filter === "active") {
                return !item.completed;
              }

              if (filter === "completed") {
                return item.completed;
              }

              return true;
            })
            .map((item) => (
              <div
                className={`task-item ${
                  item.completed ? "completed" : ""
                }`}
                key={item.id}
              >

                {editingId === item.id ? (
                  <input
                    className="edit-input"
                    value={editingText}
                    onChange={(e) =>
                      setEditingText(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveEdit(item.id);
                      }
                    }}
                  />
                ) : (
                  <div className="task-content">
                    <span>{item.text}</span>

                    <small>
                      Created:{" "}
                      {item.createdAt || "Earlier"}
                    </small>
                  </div>
                )}

                <div className="task-actions">

                  {editingId === item.id ? (
                    <button
                      onClick={() => saveEdit(item.id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => toggleTask(item.id)}
                  >
                    {item.completed ? "Undo" : "Complete"}
                  </button>

                  <button
                    onClick={() => deleteTask(item.id)}
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))}

          {tasks.length > 0 &&
            tasks
              .filter((item) =>
                item.text
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .filter((item) => {
                if (filter === "active") {
                  return !item.completed;
                }

                if (filter === "completed") {
                  return item.completed;
                }

                return true;
              }).length === 0 && (
                <div className="no-results">
                  🔍 No matching tasks found
                </div>
              )}

        </div>
      </div>
    </div>
  );
}

export default App;