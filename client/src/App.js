import React, { useState } from "react";
import TaskList from "./components/TaskList";
import TaskView from "./components/TaskView";

export default function App() {
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  return (
    <div className="app">
      <header>
        <h1>Simple Tasks & Comments</h1>
        <p className="subtitle">Add, edit, delete comments for a task </p>
      </header>

      <main>
        <div className="left">
          <TaskList onSelectTask={id => setSelectedTaskId(id)} selectedTaskId={selectedTaskId}/>
        </div>
        <div className="right">
          {selectedTaskId ? (
            <TaskView taskId={selectedTaskId} />
          ) : (
            <div className="placeholder">Select a task to view comments</div>
          )}
        </div>
      </main>

      <footer>
        <small>Backend API proxy is used.</small>
      </footer>
    </div>
  );
}
