import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import quotesData from './data/quotes.json';

import Header from './components/Header';
import QuoteBox from './components/QuoteBox';
import Stats from './components/Stats';
import Clock from './components/Clock';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Auth from './components/Auth';

// Helper functions for time and calendar
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const formatDate = (date) => {
  const d = new Date(date);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};
const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const getTagClass = (type) => {
  switch (type) {
    case 'study':
      return 'bg-indigo-100 text-indigo-700';
    case 'work':
      return 'bg-yellow-100 text-yellow-700';
    case 'personal':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const App = () => {
  // Auth state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // State
  const [tasks, setTasks] = useState([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [taskType, setTaskType] = useState('study');
  const [quote, setQuote] = useState({ text: 'Loading motivational quote...', author: '- Author' });
  const [weather, setWeather] = useState({
    city: 'Loading...',
    temperature: '--°C',
    description: '--',
    icon: null
  });
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const draggedItemRef = useRef(null);

  // Logout handler
  const handleLogout = () => {
    setUser(null);
    setTasks([]);
  };

  useEffect(() => {
    setTasksLoaded(false);
  }, [user]);

  // Derived state
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  // Effects
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load tasks for logged-in user
  useEffect(() => {
  if (user && user.name) {
    const key = `tasks_${user.name}`;
    const savedTasks = localStorage.getItem(key);
    console.log("Loading tasks for", key, ":", savedTasks);
    setTasks(savedTasks ? JSON.parse(savedTasks) : []);
    setTasksLoaded(true);
  }
}, [user]);

  // Save tasks for logged-in user
  useEffect(() => {
  if (user && user.name && tasksLoaded) {
    const key = `tasks_${user.name}`;
    console.log("Saving tasks for", key, ":", tasks);
    localStorage.setItem(key, JSON.stringify(tasks));
  }
}, [tasks, user, tasksLoaded]);

  useEffect(() => {
    fetchMotivationalQuote();
    getWeather();
    // eslint-disable-next-line
  }, []);

  const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // Task handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: taskInput.trim(),
        type: taskType,
        completed: false,
        createdAt: new Date()
      }
    ]);
    setTaskInput('');
    setTaskType('study');
  };

  const toggleTaskComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Edit task
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  const handleEditChange = (e) => {
    setEditingText(e.target.value);
  };

  const saveEdit = (taskId) => {
    if (editingText.trim() === '') return;
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, text: editingText.trim() } : task
    ));
    setEditingTaskId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingText('');
  };

  // Motivational quote
  const fetchMotivationalQuote = () => {
    setQuote({ text: 'Loading motivational quote...', author: '- Author' });
    try {
      const randomIndex = Math.floor(Math.random() * quotesData.length);
      const randomQuote = quotesData[randomIndex];
      setQuote({
        text: randomQuote.text,
        author: randomQuote.author
      });
    } catch {
      setQuote({ text: 'Stay motivated!', author: '- Unknown' });
    }
  };

  // Weather (dummy, replace with real API if needed)
  const getWeather = () => {
    setWeather({
      city: 'Your City',
      temperature: '25°C',
      description: 'Sunny',
      icon: '☀️'
    });
  };

  // Calendar helpers
  const prevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`}></div>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(
        <div
          key={d}
          className={`p-1 rounded-full text-center ${d === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? 'bg-indigo-200 font-bold' : ''}`}
        >
          {d}
        </div>
      );
    }
    return days;
  };

  // Sort tasks by creation date (latest first)
  const sortedTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!user) {
    return <Auth onAuth={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header weather={weather} userName={user?.name} handleLogout={handleLogout} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left column - Quote, stats, clock/calendar */}
          <div className="lg:col-span-1 space-y-6">
            <QuoteBox quote={quote} fetchMotivationalQuote={fetchMotivationalQuote} />
            <Stats
              completedTasks={completedTasks}
              totalTasks={tasks.length}
              completionPercentage={completionPercentage}
            />
            <Clock
              currentTime={currentTime}
              formatTime={formatTime}
              monthNames={monthNames}
              calendarDate={calendarDate}
              prevMonth={prevMonth}
              nextMonth={nextMonth}
              renderCalendar={renderCalendar}
            />
          </div>

          {/* Right column - Tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800 text-xl flex items-center">
                  Today's Study Plan
                </h2>
                <TaskForm
                  taskInput={taskInput}
                  setTaskInput={setTaskInput}
                  taskType={taskType}
                  setTaskType={setTaskType}
                  handleSubmit={handleSubmit}
                />
              </div>
              <div className="task-list overflow-y-auto" style={{ maxHeight: '500px' }}>
                <TaskList
                  tasks={sortedTasks}
                  editingTaskId={editingTaskId}
                  editingText={editingText}
                  startEditing={startEditing}
                  handleEditChange={handleEditChange}
                  saveEdit={saveEdit}
                  cancelEdit={cancelEdit}
                  toggleTaskComplete={toggleTaskComplete}
                  deleteTask={deleteTask}
                  capitalizeFirstLetter={capitalizeFirstLetter}
                  formatDate={formatDate}
                  getTagClass={getTagClass}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;