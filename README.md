# Task Manager — learning `useReducer`, `useContext`, and React Router

A small task-manager app built to demonstrate three core React concepts.
The code is deliberately flat and heavily commented so it can be read
top-to-bottom as a learning resource.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## The three concepts, and where to find them

### 1. `useReducer` — `src/reducer/taskReducer.js`

A reducer is a function `(state, action) => newState`. It is the single
place that describes *how* state is allowed to change.

| Action | Payload | Effect |
| --- | --- | --- |
| `ADD_TASK` | task object | appends to `tasks` |
| `DELETE_TASK` | task id | removes from `tasks` |
| `SET_FILTER` | `'all' \| 'todo' \| 'in-progress' \| 'done'` | updates `filter` |

Two rules the file demonstrates:

- **Reducers must be pure.** No `Date.now()`, no `Math.random()`, no API
  calls. React deliberately runs reducers twice in development
  (`StrictMode`) to expose impurity — an id generated inside the reducer
  would come out different each time. That is why the new task's `id` is
  created in `addTask` and passed in as the payload instead.
- **Never mutate state.** Every case returns a *new* object/array
  (`{ ...state }`, `[...state.tasks]`). React compares by reference, so
  mutating in place would leave the UI un-updated.

### 2. `useContext` — `src/context/TaskContext.jsx`

Context avoids "prop drilling": passing data down through components
that do not care about it. `TaskProvider` holds the `useReducer` and
publishes `tasks`, `filteredTasks`, `filter`, `addTask`, `deleteTask`,
and `setFilter`. Any component below it calls `useTasks()` to read them.

**`filteredTasks` is derived during render**, not stored:

```js
const filteredTasks =
  state.filter === 'all'
    ? state.tasks
    : state.tasks.filter((task) => task.status === state.filter);
```

It is recalculated on every render from the two things actually stored
(`tasks` and `filter`). Keeping it in state as well would create a
second source of truth that could drift out of sync.

### 3. React Router — `src/main.jsx` and `src/App.jsx`

| Path | Component |
| --- | --- |
| `/` | redirects to `/tasks` |
| `/tasks` | `TaskListPage` |
| `/tasks/:id` | `TaskDetailPage` |

`<BrowserRouter>` wraps the app in `main.jsx`. `<Header />` renders
*outside* `<Routes>`, so it stays on screen while the page swaps.

**The `useParams` gotcha** (`src/pages/TaskDetailPage.jsx`): URL params
are always **strings**, but the task ids are **numbers**. So
`task.id === id` would never match and every task would show
"Task not found". Hence:

```js
const task = tasks.find((item) => item.id === Number(id));
```

## Project structure

```
src/
├── reducer/taskReducer.js      # state transitions + seed data
├── context/TaskContext.jsx     # provider, derived filteredTasks, action helpers
├── components/
│   ├── Header.jsx              # app name, shown on every page
│   ├── FilterBar.jsx           # All / To Do / In Progress / Done
│   ├── TaskList.jsx            # renders filteredTasks
│   └── AddTaskForm.jsx         # controlled form
├── pages/
│   ├── TaskListPage.jsx        # /tasks
│   └── TaskDetailPage.jsx      # /tasks/:id
├── App.jsx                     # provider + route definitions
└── main.jsx                    # BrowserRouter
```

## Two other things worth noticing

- **Only the task title is a `<Link>`, not the whole row**
  (`TaskList.jsx`). If the entire row were wrapped in a link, clicking
  *Delete* would also navigate to the detail page.
- **`onClick={() => deleteTask(task.id)}`, not `onClick={deleteTask(task.id)}`.**
  The second form calls the function immediately during render instead
  of on click — a very common beginner bug.

## Note on `npm audit`

`npm install` reports a high-severity advisory for `react-router`. It
applies only to **RSC (React Server Components) mode**, which this
client-side SPA does not use. Do not run `npm audit fix --force` — the
only "fix" currently available is a breaking downgrade to 7.11.0.
