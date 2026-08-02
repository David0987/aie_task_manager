// AddTaskForm — a "controlled form" for creating a new task.
import { useState } from 'react';
import { useTasks } from '../context/TaskContext.jsx';

// What the form looks like when empty. Kept as a constant so we can
// reuse it both for the initial state and for clearing after submit.
const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
};

function AddTaskForm() {
  const { addTask } = useTasks();

  // CONTROLLED FORM: React state is the single source of truth for what
  // is in each input. The input shows state (value={...}) and reports
  // changes back (onChange={...}). Because of that, `form` below always
  // reflects exactly what the user sees on screen.
  const [form, setForm] = useState(EMPTY_FORM);

  // One handler for all four inputs. Each input has a name= that matches
  // a key in our form object, so [name] picks the right one.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    // Without this the browser reloads the page on submit and all our
    // React state is lost.
    event.preventDefault();

    // Simple validation: do not add a task with a blank title.
    if (form.title.trim() === '') {
      return;
    }

    addTask(form);
    setForm(EMPTY_FORM); // clear the form on success
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2>Add a task</h2>

      <label className="field">
        Title
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="What needs doing?"
        />
      </label>

      <label className="field">
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="3"
          placeholder="Add a little more detail..."
        />
      </label>

      <div className="field-row">
        <label className="field">
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label className="field">
          Priority
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <button type="submit" className="submit-btn">
        Add task
      </button>
    </form>
  );
}

export default AddTaskForm;
