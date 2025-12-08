import React, { useState } from "react";
import TaskList from "./components/TaskList";
import TaskView from "./components/TaskView";
import "./App.css";

export default function App() {
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tasks & Comments</h1>
      </header>

      <main className="app-main">
        <aside className="app-left">
          <TaskList selectedTaskId={selectedTaskId} onSelectTask={(id) => setSelectedTaskId(id)} />
        </aside>

        <section className="app-right">
          {selectedTaskId ? <TaskView taskId={selectedTaskId} /> : <div className="empty">Select a task</div>}
        </section>
      </main>
    </div>
  );
}
