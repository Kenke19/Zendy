import React from "react";

const TaskForm = ({ taskInput, setTaskInput, taskType, setTaskType, handleSubmit }) => (
  <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
    <input
      type="text"
      value={taskInput}
      onChange={e => setTaskInput(e.target.value)}
      placeholder="Add a new task..."
      className="flex-1 px-3 py-2 rounded border border-gray-300"
      required
    />
    <select
      value={taskType}
      onChange={e => setTaskType(e.target.value)}
      className="px-2 py-2 rounded border border-gray-300"
    >
      <option value="study">Study</option>
      <option value="work">Work</option>
      <option value="personal">Personal</option>
    </select>
    <button
      type="submit"
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
    >
      Add
    </button>
  </form>
);

export default TaskForm;