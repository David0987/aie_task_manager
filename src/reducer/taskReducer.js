// =====================================================================
// taskReducer — the single place where task state changes are described
// =====================================================================
// A "reducer" is just a function: (currentState, action) => newState
//
// It answers one question: "given what the state is now, and a
// description of something that happened, what should the state become?"
//
// TWO RULES a reducer must always follow:
//   1. It must be PURE. Same inputs -> same output, every time. No API
//      calls, no Math.random(), no Date.now(), no mutating the old state.
//      (React runs reducers twice in development to catch impurity, so a
//      Date.now() in here would produce two different ids!)
//   2. It must return a NEW object instead of editing the old one. React
//      compares old and new by reference to decide whether to re-render.
//      Mutating `state.tasks.push(...)` keeps the same reference, so
//      React sees "nothing changed" and your UI does not update.
// =====================================================================

// The seed data the app starts with.
export const initialTasks = [
  {
    id: 1,
    title: 'Set up project repository',
    description:
      'Initialise a Git repo, add a .gitignore, and push the first commit.',
    status: 'done',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Design database schema',
    description: 'Draft the ERD for the contacts and deals tables.',
    status: 'done',
    priority: 'high',
  },
  {
    id: 3,
    title: 'Build login page',
    description:
      'Create a login form with email and password fields and basic validation.',
    status: 'in-progress',
    priority: 'high',
  },
  {
    id: 4,
    title: 'Write unit tests for reducer',
    description:
      'Cover ADD_TASK, DELETE_TASK, and SET_FILTER with at least two cases each.',
    status: 'todo',
    priority: 'medium',
  },
  {
    id: 5,
    title: 'Update README',
    description:
      'Add setup instructions, a screenshot, and a description of the tech stack.',
    status: 'todo',
    priority: 'low',
  },
  {
    id: 6,
    title: 'Deploy to Vercel',
    description:
      'Connect the GitHub repo to Vercel and configure environment variables.',
    status: 'todo',
    priority: 'medium',
  },
];

// The shape of our whole app state: the list of tasks, plus which filter
// the user currently has selected.
//
// Notice what is NOT here: `filteredTasks`. The filtered list can always
// be worked out from `tasks` + `filter`, so storing it too would mean
// keeping two things in sync. We calculate it during render instead
// (see TaskContext.jsx).
export const initialState = {
  tasks: initialTasks,
  filter: 'all', // 'all' | 'todo' | 'in-progress' | 'done'
};

export function taskReducer(state, action) {
  switch (action.type) {
    // action.payload is a complete task object, already built (with its
    // id) by addTask in TaskContext. The reducer stays pure this way.
    case 'ADD_TASK':
      return {
        ...state, // copy everything already in state (e.g. filter)
        tasks: [...state.tasks, action.payload], // new array, task on the end
      };

    // action.payload is the id of the task to remove.
    // .filter() returns a NEW array containing everything that is not
    // that task — the original array is left untouched.
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    // action.payload is 'all' | 'todo' | 'in-progress' | 'done'
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
      };

    // Always handle the unknown case by returning state unchanged, so a
    // typo in an action type can never wipe out your data.
    default:
      return state;
  }
}
