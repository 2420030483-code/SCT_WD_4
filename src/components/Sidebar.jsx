import React, { useState } from 'react';
import { Layers, Plus, Trash2, FolderOpen } from 'lucide-react';

export default function Sidebar({ lists, activeList, setActiveList, addList, deleteList, tasks }) {
  const [newListInput, setNewListInput] = useState('');

  const handleAddListSubmit = (e) => {
    e.preventDefault();
    if (!newListInput.trim()) return;
    addList(newListInput.trim());
    setNewListInput('');
  };

  // Helper to count active tasks in a list
  const getTaskCountForList = (listName) => {
    return tasks.filter(task => task.list === listName).length;
  };

  // Helper to calculate overall progress percentage
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <FolderOpen size={24} style={{ color: '#8b5cf6' }} />
          <h1>ZenTask</h1>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-title">My Workspaces</div>
          <ul className="nav-list">
            {lists.map((list) => {
              const isDefaultList = ['Personal', 'Work', 'Shopping'].includes(list);
              return (
                <li key={list} className="list-item-container">
                  <button
                    className={`nav-item ${activeList === list ? 'active' : ''}`}
                    onClick={() => setActiveList(list)}
                  >
                    <div className="nav-item-content">
                      <Layers size={16} />
                      <span>{list}</span>
                    </div>
                    <span className="badge">{getTaskCountForList(list)}</span>
                  </button>
                  
                  {!isDefaultList && (
                    <button
                      className="delete-list-btn"
                      onClick={() => deleteList(list)}
                      title="Delete Workspace"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          <form onSubmit={handleAddListSubmit} className="add-list-form">
            <input
              type="text"
              placeholder="New workspace..."
              className="add-list-input"
              value={newListInput}
              onChange={(e) => setNewListInput(e.target.value)}
              maxLength={20}
            />
            <button type="submit" className="add-list-btn" title="Create Workspace">
              <Plus size={16} style={{ color: '#ffffff' }} />
            </button>
          </form>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="progress-section">
          <div className="progress-header">
            <span>Overall Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
