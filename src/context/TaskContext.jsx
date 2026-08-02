/* eslint-disable react-refresh/only-export-components */
// The rule above prefers one component per file. We keep the context,
// the provider, and the useTasks hook together here because they are
// three parts of one idea (and the assignment asks for this file). The
// only downside is slightly less efficient hot-reloading in dev.

// =====================================================================
// TaskContext — makes the task state available to every component
// =====================================================================
// THE PROBLEM CONTEXT SOLVES:
// Our task state lives here, but <TaskList> and <TaskDetailPage> are
// several levels down the component tree. Without context we would have
// to pass tasks/addTask/deleteTask down through every component in
// between, even the ones that do not care about them ("prop drilling").
//
// Context lets us put a value in at the top and read it directly from
// any component underneath, no matter how deep.
//
// THREE PIECES:
//   1. createContext()  — creates the "channel"
//   2. <TaskContext.Provider value={...}> — puts data into the channel
//   3. useContext(TaskContext) — reads data out, from any child
// =====================================================================

import { createContext, useContext, useReducer } from 'react';
import { taskReducer, initialState } from '../reducer/taskReducer.js';

// 1. Create the context.
export const TaskContext = createContext(null);

// 2. The Provider component. Everything inside <TaskProvider> can read
//    the value we supply below.
export function TaskProvider({ children }) {
  // useReducer takes (reducer, initialState) and gives us back:
  //   - state:    the current state object
  //   - dispatch: a function to send an action to the reducer
  //
  // Compare with useState: useState is great for one simple value.
  // useReducer is better when several values change together in
  // well-defined ways — exactly our case (tasks + filter).
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // ------------------------------------------------------------------
  // DERIVED STATE — calculated during render, never stored.
  // ------------------------------------------------------------------
  // Every time this component renders we recalculate the filtered list
  // from the two things we DO store: state.tasks and state.filter.
  //
  // We deliberately do NOT keep filteredTasks in state (and do NOT sync
  // it with useEffect). If we did, we would have two sources of truth
  // that could drift apart — e.g. delete a task and the filtered list
  // still shows it. Deriving it means it is always correct, for free.
  const filteredTasks =
    state.filter === 'all'
      ? state.tasks
      : state.tasks.filter((task) => task.status === state.filter);

  // ------------------------------------------------------------------
  // ACTION HELPERS
  // ------------------------------------------------------------------
  // Components call these instead of using dispatch directly. It keeps
  // action type strings in one file and gives components a simple API.

  // Takes the plain fields from the form and builds the complete task
  // object, INCLUDING the id, before handing it to the reducer.
  // The id is generated here (not in the reducer) so the reducer stays
  // a pure function — see the note at the top of taskReducer.js.
  const addTask = (fields) => {
    const newTask = {
      id: Date.now(), // simple unique-enough id for a learning app
      title: fields.title,
      description: fields.description,
      status: fields.status,
      priority: fields.priority,
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const deleteTask = (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const setFilter = (filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  // This object is what every child component receives from useTasks().
  const value = {
    tasks: state.tasks,
    filteredTasks,
    filter: state.filter,
    addTask,
    deleteTask,
    setFilter,
  };

  return (
    <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
  );
}

// 3. A small helper so components can write `useTasks()` instead of
//    `useContext(TaskContext)`. It also gives a clear error if you
//    forget to wrap your app in <TaskProvider>.
export function useTasks() {
  const context = useContext(TaskContext);
  if (context === null) {
    throw new Error('useTasks() must be used inside a <TaskProvider>');
  }
  return context;
}
