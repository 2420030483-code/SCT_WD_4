import React from 'react';
import { CheckCircle, Clock, ClipboardList } from 'lucide-react';

export default function StatsCard({ total, completed, pending }) {
  return (
    <div className="stats-cards-grid">
      <div className="stats-card">
        <div className="stats-icon-wrapper" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
          <ClipboardList size={22} />
        </div>
        <div className="stats-info">
          <span className="stats-count">{total}</span>
          <span className="stats-label">Total Tasks</span>
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
          <CheckCircle size={22} />
        </div>
        <div className="stats-info">
          <span className="stats-count">{completed}</span>
          <span className="stats-label">Completed</span>
        </div>
      </div>

      <div className="stats-card">
        <div className="stats-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
          <Clock size={22} />
        </div>
        <div className="stats-info">
          <span className="stats-count">{pending}</span>
          <span className="stats-label">Pending</span>
        </div>
      </div>
    </div>
  );
}
