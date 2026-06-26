import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSubmit, taskToEdit, lists }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [list, setList] = useState('');
  const [priority, setPriority] = useState('low');

  // Load existing task data if we are editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate || '');
      setDueTime(taskToEdit.dueTime || '');
      setList(taskToEdit.list || lists[0] || 'Personal');
      setPriority(taskToEdit.priority || 'low');
    } else {
      // Default reset for adding new task
      setTitle('');
      setDescription('');
      setDueDate('');
      setDueTime('');
      setList(lists[0] || 'Personal');
      setPriority('low');
    }
  }, [taskToEdit, isOpen, lists]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      dueTime,
      list,
      priority,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{taskToEdit ? 'Edit Task' : 'Add New Task'}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-title">Task Title *</label>
            <input
              type="text"
              id="task-title"
              className="form-control"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              className="form-control"
              placeholder="Add details, notes, links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-date">Due Date</label>
              <input
                type="date"
                id="task-date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-time">Due Time</label>
              <input
                type="time"
                id="task-time"
                className="form-control"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-list">Workspace List</label>
            <select
              id="task-list"
              className="form-control"
              value={list}
              onChange={(e) => setList(e.target.value)}
            >
              {lists.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <div className="priority-selector">
              <button
                type="button"
                className={`priority-option low ${priority === 'low' ? 'selected' : ''}`}
                onClick={() => setPriority('low')}
              >
                Low
              </button>
              <button
                type="button"
                className={`priority-option medium ${priority === 'medium' ? 'selected' : ''}`}
                onClick={() => setPriority('medium')}
              >
                Medium
              </button>
              <button
                type="button"
                className={`priority-option high ${priority === 'high' ? 'selected' : ''}`}
                onClick={() => setPriority('high')}
              >
                High
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
