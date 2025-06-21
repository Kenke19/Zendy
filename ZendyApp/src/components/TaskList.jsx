import React from 'react';
import { FaCheckCircle, FaCircle, FaTrash } from 'react-icons/fa';
import TaskItem from './TaskItem';

  const TaskList = ({
    tasks,
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
    <ul id="task-list" className="divide-y divide-gray-200">
      {tasks.length === 0 ? (
        <li className="p-4 text-center text-gray-500" id="empty-state">
          No tasks for today. Add a new task!
        </li>
      ) : (
        tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            draggedItemRef={draggedItemRef}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragEnd={handleDragEnd}
            toggleTaskComplete={toggleTaskComplete}
            editingTaskId={editingTaskId}
            editingText={editingText}
            handleEditChange={handleEditChange}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            startEditing={startEditing}
            deleteTask={deleteTask}
            getTagClass={getTagClass}
            capitalizeFirstLetter={capitalizeFirstLetter}
            formatDate={formatDate}
          />
        ))
      )}
    </ul>
  );

export default TaskList;