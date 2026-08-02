// TaskListPage — the page shown at /tasks
// It is just a layout: the real work happens inside the three children,
// each of which gets its data straight from TaskContext.
import FilterBar from '../components/FilterBar.jsx';
import TaskList from '../components/TaskList.jsx';
import AddTaskForm from '../components/AddTaskForm.jsx';

function TaskListPage() {
  return (
    <main className="page">
      <FilterBar />
      <TaskList />
      <AddTaskForm />
    </main>
  );
}

export default TaskListPage;
