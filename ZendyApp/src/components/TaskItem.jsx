import React from 'react';
import { FaCheckCircle, FaCircle, FaTrash } from 'react-icons/fa';


  const TaskItem = ({
    task,
    draggedItemRef,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    toggleTaskComplete,
    editingTaskId,
    editingText,
    handleEditChange,
    saveEdit,
    cancelEdit,
    startEditing,
    deleteTask,
    getTagClass,
    capitalizeFirstLetter,
    formatDate,
  }) => (
    <li
      className={`task-item p-4 hover:bg-gray-50 cursor-move flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 ${
        task.completed ? 'bg-gray-50' : 'bg-white'
      } ${(draggedItemRef && draggedItemRef.current === task.id) ? 'dragging opacity-50 bg-gray-200' : ''}`}
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, task.id)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-start flex-1 min-w-0">
        <button
          className="complete-btn mr-3 mt-1 text-gray-400 hover:text-green-500 transition"
          data-id={task.id}
          onClick={() => toggleTaskComplete(task.id)}
        >
          {task.completed ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaCircle />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {editingTaskId === task.id ? (
              <input
                type="text"
                className="border border-indigo-500 rounded px-2 py-1 text-gray-800 flex-1 min-w-0"
                value={editingText}
                onChange={handleEditChange}
                onBlur={() => saveEdit(task.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveEdit(task.id);
                  } else if (e.key === 'Escape') {
                    cancelEdit();
                  }
                }}
                autoFocus
              />
            ) : (
              <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-800'} break-words`}>
                {task.text}
              </span>
            )}
            <div className="flex-shrink-0 mt-2 sm:mt-0 ml-0 sm:ml-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getTagClass(task.type)}`}>
                {capitalizeFirstLetter(task.type)}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Added {formatDate(task.createdAt)}
          </div>
        </div>
      </div>
      <div className="flex items-center mt-2 sm:mt-0 ml-0 sm:ml-3 gap-3">
        <button
          className="edit-btn text-gray-400 hover:text-blue-500 transition"
          data-id={task.id}
          onClick={() => startEditing(task)}
          title="Edit task"
        >
          ✏️
        </button>
        <button
          className="delete-btn text-gray-400 hover:text-red-500 transition"
          data-id={task.id}
          onClick={() => deleteTask(task.id)}
        >
          <FaTrash />
        </button>
      </div>
    </li>
  );

export default TaskItem;
