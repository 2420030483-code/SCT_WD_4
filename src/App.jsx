import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StatsCard from './components/StatsCard';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import { Search, Plus } from 'lucide-react';
import './App.css';

// Initial dummy data for empty states to demonstrate premium look
const DEFAULT_LISTS = ['Personal', 'Work', 'Shopping'];

const DEFAULT_TASKS = [
  {
    id: '1',
    title: 'Welcome to ZenTask! 🌟',
    description: 'ZenTask helps you organize your daily tasks, projects, and agendas easily. Explore lists on the sidebar!',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '12:00',
    list: 'Personal',
    priority: 'low',
    completed: true,
    createdAt: Date.now() - 3600000
  },
  {
    id: '2',
    title: 'Finish Skill Craft Task 4 🚀',
    description: 'Build and deploy a gorgeous glassmorphic To-Do web app with list organization and date/time tracking.',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '23:59',
    list: 'Work',
    priority: 'high',
    completed: false,
    createdAt: Date.now() - 1800000
  },
  {
    id: '3',
    title: 'Organize grocery checklist 🥦',
    description: 'Pick up milk, fresh spinach, blueberries, avocados, and whole-wheat bread.',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dueTime: '10:00',
    list: 'Shopping',
    priority: 'medium',
    completed: false,
    createdAt: Date.now()
  },
  {
    id: '4',
    title: 'Conduct code review and refactoring 💻',
    description: 'Review index.css rules and simplify layout styles to match pure CSS structure guidelines.',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    dueTime: '18:00',
    list: 'Work',
    priority: 'medium',
    completed: false,
    createdAt: Date.now() - 90000000
  }
];

export default function App() {
  // Load initial states from LocalStorage or default fallback
  const [lists, setLists] = useState(() => {
    const saved = localStorage.getItem('zentask_lists');
    return saved ? JSON.parse(saved) : DEFAULT_LISTS;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('zentask_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [activeList, setActiveList] = useState('Personal');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('zentask_lists', JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem('zentask_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // List Handlers
  const addList = (name) => {
    if (lists.includes(name)) return;
    setLists([...lists, name]);
    setActiveList(name);
  };

  const deleteList = (name) => {
    // Cannot delete default categories
    if (DEFAULT_LISTS.includes(name)) return;
    setLists(lists.filter(l => l !== name));
    // Clean up tasks in deleted list
    setTasks(tasks.filter(t => t.list !== name));
    // Fallback active list to default if deleted
    if (activeList === name) {
      setActiveList('Personal');
    }
  };

  // Task Handlers
  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleAddTaskSubmit = (taskData) => {
    if (taskToEdit) {
      // Editing Mode
      setTasks(
        tasks.map(task =>
          task.id === taskToEdit.id ? { ...task, ...taskData } : task
        )
      );
      setTaskToEdit(null);
    } else {
      // Adding Mode
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        completed: false,
        createdAt: Date.now()
      };
      setTasks([newTask, ...tasks]);
    }
  };

  const handleEditTrigger = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Filter & Search Logic
  const getFilteredTasks = () => {
    // 1. First filter by Workspace (List)
    let listTasks = tasks.filter(task => task.list === activeList);

    // 2. Filter by status tabs
    const todayStr = new Date().toISOString().split('T')[0];
    const currentDateTime = new Date();

    if (filter === 'pending') {
      listTasks = listTasks.filter(t => !t.completed);
    } else if (filter === 'completed') {
      listTasks = listTasks.filter(t => t.completed);
    } else if (filter === 'today') {
      listTasks = listTasks.filter(t => t.dueDate === todayStr && !t.completed);
    } else if (filter === 'overdue') {
      listTasks = listTasks.filter(t => {
        if (!t.dueDate || t.completed) return false;
        const taskDateTimeStr = t.dueTime ? `${t.dueDate}T${t.dueTime}` : `${t.dueDate}T23:59:59`;
        return new Date(taskDateTimeStr) < currentDateTime;
      });
    }

    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      listTasks = listTasks.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    return listTasks;
  };

  // Calculate statistics for currently active list
  const activeListTasks = tasks.filter(task => task.list === activeList);
  const totalCount = activeListTasks.length;
  const completedCount = activeListTasks.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;

  const filteredTasks = getFilteredTasks();

  return (
    <div className="app-container">
      <Sidebar
        lists={lists}
        activeList={activeList}
        setActiveList={setActiveList}
        addList={addList}
        deleteList={deleteList}
        tasks={tasks}
      />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-title-area">
            <h2>{activeList} Tasks</h2>
            <p>Organize, schedule, and complete your tasks efficiently.</p>
          </div>

          <div className="header-actions">
            <div className="search-container">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search tasks..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              className="add-task-trigger-btn"
              onClick={() => {
                setTaskToEdit(null);
                setIsModalOpen(true);
              }}
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>
          </div>
        </header>

        <StatsCard
          total={totalCount}
          completed={completedCount}
          pending={pendingCount}
        />

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Tasks
          </button>
          <button
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`filter-tab ${filter === 'today' ? 'active' : ''}`}
            onClick={() => setFilter('today')}
          >
            Due Today
          </button>
          <button
            className={`filter-tab ${filter === 'overdue' ? 'active' : ''}`}
            onClick={() => setFilter('overdue')}
          >
            Overdue
          </button>
        </div>

        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTrigger}
          onDelete={handleDeleteTask}
        />

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setTaskToEdit(null);
          }}
          onSubmit={handleAddTaskSubmit}
          taskToEdit={taskToEdit}
          lists={lists}
        />
      </main>
    </div>
  );
}
