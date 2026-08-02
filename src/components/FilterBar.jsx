// FilterBar — four buttons that change which tasks are shown.
import { useTasks } from '../context/TaskContext.jsx';

// Defined outside the component so the array is not rebuilt on every
// render. `value` matches task.status; `label` is what the user sees.
const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

function FilterBar() {
  // Reading straight from context — no props needed, even though the
  // state actually lives up in TaskProvider.
  const { filter, setFilter } = useTasks();

  return (
    <div className="filter-bar">
      {FILTERS.map((item) => (
        <button
          key={item.value}
          type="button"
          // Highlight whichever button matches the current filter.
          // Template literal builds the class name conditionally.
          className={`filter-btn ${filter === item.value ? 'active' : ''}`}
          onClick={() => setFilter(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
