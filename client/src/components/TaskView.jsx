import React, { useEffect, useState } from "react";
import Comments from "./Comments";

export default function TaskView({ taskId }) {
  const [task, setTask] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/tasks/${taskId}`);
        if (!res.ok) {
          if (mounted) setTask(null);
          return;
        }
        const d = await res.json();
        if (mounted) setTask(d);
      } catch (e) {
        if (mounted) setTask(null);
      }
    })();
    return () => (mounted = false);
  }, [taskId]);

  if (!task) return <div>Loading task...</div>;

  return (
    <div>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <hr />
      <Comments taskId={taskId} />
    </div>
  );
}
