import React, { useEffect, useState } from "react";

export default function TaskList({ selectedTaskId, onSelectTask }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        if (mounted) {
          const arr = Array.isArray(data) ? data : (data ? [data] : []);
          setTasks(arr);
        }
      } catch (e) {
        console.error("Failed to load tasks", e);
        if (mounted) setTasks([]);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <h3>Tasks</h3>
      {tasks.map(t => (
        <div
          key={t.id}
          className={`task-card ${t.id === selectedTaskId ? "selected" : ""}`}
          onClick={() => onSelectTask(t.id)}
        >
          <div className="task-title">{t.title}</div>
          <div className="task-desc">{t.description}</div>
        </div>
      ))}
    </div>
  );
}
