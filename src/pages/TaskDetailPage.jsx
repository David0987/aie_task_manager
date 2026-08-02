// TaskDetailPage — the page shown at /tasks/:id
import { useParams, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext.jsx';

function TaskDetailPage() {
  // useParams() reads the dynamic part of the URL. Our route is defined
  // as "/tasks/:id", so the key here is `id`.
  const { id } = useParams();

  // We search the FULL task list, not filteredTasks — otherwise a task
  // hidden by the current filter would wrongly show "Task not found".
  const { tasks } = useTasks();

  // IMPORTANT: values from useParams are always STRINGS ("1"), but our
  // task ids are NUMBERS (1). Using === without converting would never
  // match, so every task would look missing. Number(id) fixes that.
  const task = tasks.find((item) => item.id === Number(id));

  // Handle the genuine "no such task" case, e.g. /tasks/999
  if (!task) {
    return (
      <main className="page">
        <p className="empty">Task not found.</p>
        <Link to="/tasks" className="back-link">
          &larr; Back to all tasks
        </Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link to="/tasks" className="back-link">
        &larr; Back to all tasks
      </Link>

      <article className="task-detail">
        <h2>{task.title}</h2>

        <div className="task-meta">
          <span className={`badge status-${task.status}`}>{task.status}</span>
          <span className={`badge priority-${task.priority}`}>
            {task.priority}
          </span>
        </div>

        <p className="task-description">{task.description}</p>

        <p className="task-id">Task ID: {task.id}</p>
      </article>
    </main>
  );
}

export default TaskDetailPage;
