import React from 'react';
import { FaChartPie } from 'react-icons/fa';

  const Stats = ({ completedTasks, totalTasks, completionPercentage }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
        <FaChartPie className="text-indigo-600 mr-2" />
        Today's Progress
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Tasks Completed</span>
            <span id="completed-count">{completedTasks} / {totalTasks}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              id="completed-bar"
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

export default Stats;