// =====================================================================
// App — puts the three concepts together
// =====================================================================
// The nesting order matters:
//
//   <BrowserRouter>      enables client-side routing. Must sit ABOVE
//                        anything using <Link>, <Routes> or useParams.
//     <TaskProvider>     shares task state with everything below it
//       <Header />       outside <Routes>, so it shows on every page
//       <Routes>         swaps the page based on the current URL
// =====================================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext.jsx';
import Header from './components/Header.jsx';
import TaskListPage from './pages/TaskListPage.jsx';
import TaskDetailPage from './pages/TaskDetailPage.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* Everything inside TaskProvider can call useTasks(). */}
      <TaskProvider>
        <div className="app">
          {/* Rendered outside <Routes>, so it stays put as pages change. */}
          <Header />

          {/* <Routes> renders whichever single <Route> matches the URL. */}
          <Routes>
            {/* "/" sends the user to "/tasks".
                `replace` swaps the history entry instead of adding one, so
                the browser Back button does not bounce between / and /tasks. */}
            <Route path="/" element={<Navigate to="/tasks" replace />} />

            <Route path="/tasks" element={<TaskListPage />} />

            {/* ":id" is a URL parameter. Visiting /tasks/3 makes
                useParams() return { id: "3" } inside TaskDetailPage. */}
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
          </Routes>
        </div>
      </TaskProvider>
    </BrowserRouter>
  );
}

export default App;
