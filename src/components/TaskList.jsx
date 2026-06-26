import React from 'react';
import { Edit2, Trash2, Calendar, Clock, Check, Inbox } from 'lucide-react';

export default function TaskList({ tasks, onToggleComplete, onEdit, onDelete }) {
  
  // Date status check utility
  const getDateStatus = (dueDate, dueTime, completed) => {
    if (!dueDate || completed) return { label: null, className: '' };

    const todayStr = new Date().toISOString().split('T')[0];
    const taskDateStr = dueDate;
    
    // Parse combined date and time
    const currentDateTime = new Date();
    const taskDateTimeStr = dueTime ? `${dueDate}T${dueTime}` : `${dueDate}T23:59:59`;
    const taskDateTime = new Date(taskDateTimeStr);

    if (taskDateTime < currentDateTime) {
      return { label: 'Overdue', className: 'overdue' };
    } else if (taskDateStr === todayStr) {
      return { label: 'Today', className: 'due-soon' };
    }

    return { label: null, className: '' };
  };

  // Format date readable
  const formatReadableDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time readable (12h clock)
  const formatReadableTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  if (tasks.length === 0) {
    return (
      <div className="no-tasks-state">
        <Inbox size={48} style={{ opacity: 0.3 }} />
        <p>No tasks found. Click "Add Task" to get started!</p>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      {tasks.map((task) => {
        const { label: dateStatusLabel, className: dateStatusClass } = getDateStatus(
          task.dueDate,
          task.dueTime,
          task.completed
        );

        return (
          <div
            key={task.id}
            className={`task-card priority-${task.priority} ${task.completed ? 'completed' : ''}`}
          >
            <div className="task-main-info">
              <button
                className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
                onClick={() => onToggleComplete(task.id)}
                title={task.completed ? 'Mark incomplete' : 'Mark completed'}
              >
                <Check size={14} strokeWidth={3} />
              </button>

              <div className="task-details">
                <span className="task-title">{task.title}</span>
                {task.description && <span className="task-desc">{task.description}</span>}
                
                <div className="task-meta">
                  {task.dueDate && (
                    <span className="meta-badge">
                      <Calendar size={12} />
                      {formatReadableDate(task.dueDate)}
                    </span>
                  )}
                  {task.dueTime && (
                    <span className="meta-badge">
                      <Clock size={12} />
                      {formatReadableTime(task.dueTime)}
                    </span>
                  )}
                  {dateStatusLabel && (
                    <span className={`meta-badge ${dateStatusClass}`}>
                      {dateStatusLabel}
                    </span>
                  )}
                  <span className="list-tag">{task.list}</span>
                </div>
              </div>
            </div>

            <div className="task-actions">
              <button
                className="task-action-btn edit"
                onClick={() => onEdit(task)}
                title="Edit Task"
              >
                <Edit2 size={15} />
              </button>
              <button
                className="task-action-btn delete"
                onClick={() => onDelete(task.id)}
                title="Delete Task"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
