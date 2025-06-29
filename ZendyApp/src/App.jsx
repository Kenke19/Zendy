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
  const [reminders, setReminders] = useState([]);
  const [reminderDate, setReminderDate] = useState(null);
  const [reminderText, setReminderText] = useState('');

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
  //DRAG AND DROP FEATURE 
  const handleDragStart = (e, taskId) => {
  draggedItemRef.current = taskId;
};

const handleDragOver = (e) => {
  e.preventDefault();
};

const handleDrop = (e, targetTaskId) => {
  const draggedId = draggedItemRef.current;
  if (draggedId === targetTaskId) return;

  const draggedIndex = tasks.findIndex(task => task.id === draggedId);
  const targetIndex = tasks.findIndex(task => task.id === targetTaskId);

  if (draggedIndex === -1 || targetIndex === -1) return;

  const updatedTasks = [...tasks];
  const [draggedTask] = updatedTasks.splice(draggedIndex, 1);
  updatedTasks.splice(targetIndex, 0, draggedTask);

  setTasks(updatedTasks);
  draggedItemRef.current = null;
};

const handleDragEnd = () => {
  draggedItemRef.current = null;
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
      const dayDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const hasReminder = reminders.some(r => r.date === dayDate);

      days.push(
        <div
          key={d}
          onClick={() => setReminderDate(dayDate)}
          style={{ cursor: 'pointer', position: 'relative', minHeight: 28 }}
          title="Set reminder"
        >
          {d}
          {hasReminder && (
            <span
              style={{
              display: 'block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#f59e42',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: 4,
            }}
          />
        )}
        
      </div>
      );
    }
    return days;
  };


  const sortedTasks = [...tasks]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
  .sort((a, b) => a.completed - b.completed); 

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
                  Today's Study plan
                </h2>
                <TaskForm
                  taskInput={taskInput}
                  setTaskInput={setTaskInput}
                  taskType={taskType}
                  setTaskType={setTaskType}
                  handleSubmit={handleSubmit}
                />
              </div>
              <div  style={{ maxHeight: '500px' }}>
                <TaskList
                  tasks={tasks}
                  draggedItemRef={draggedItemRef} //drag and drop feature
                  handleDragStart={handleDragStart}
                  handleDragOver={handleDragOver}
                  handleDrop={handleDrop}
                  handleDragEnd={handleDragEnd} //drag and drop feature
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