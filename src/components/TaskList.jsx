// TaskList — renders the currently visible tasks.
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext.jsx';

function TaskList() {
  // filteredTasks is derived in TaskContext during render, so it is
  // always in step with the tasks and the selected filter.
  const { filteredTasks, deleteTask } = useTasks();

  // Always handle the empty case, otherwise the user sees a blank area
  // and cannot tell whether it is loading or genuinely empty.
  if (filteredTasks.length === 0) {
    return <p className="empty">No tasks match this filter.</p>;
  }

  return (
    <ul className="task-list">
      {/* key lets React tell rows apart when the list changes. Using the
          task id (stable and unique) is better than the array index. */}
      {filteredTasks.map((task) => (
        <li key={task.id} className="task-row">
          <div className="task-main">
            {/* NOTE: only the TITLE is a link, not the whole row.
                If the entire row were wrapped in <Link>, clicking
                Delete would also navigate to the detail page. */}
            <Link to={`/tasks/${task.id}`} className="task-title">
              {task.title}
            </Link>

            <div className="task-meta">
              {/* Status word goes into the class name too, so CSS can
                  colour each status differently. */}
              <span className={`badge status-${task.status}`}>
                {task.status}
              </span>
              <span className={`badge priority-${task.priority}`}>
                {task.priority}
              </span>
            </div>
          </div>

          {/* Arrow function so deleteTask runs on click, not on render.
              Writing onClick={deleteTask(task.id)} would call it
              immediately while rendering — a very common beginner bug. */}
          <button
            type="button"
            className="delete-btn"
            onClick={() => deleteTask(task.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
