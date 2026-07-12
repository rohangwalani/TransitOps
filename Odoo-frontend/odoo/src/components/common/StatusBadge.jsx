import React from 'react';

const StatusBadge = ({ status, label }) => {
  const normalizedStatus = (status || '').toLowerCase().trim();
  const textLabel = label || status;

  let colorClasses = '';

  switch (normalizedStatus) {
    case 'active':
    case 'online':
    case 'success':
    case 'completed':
    case 'delivered':
      colorClasses = 'bg-secondary-container text-on-secondary-container border border-secondary/20';
      break;
    case 'warning':
    case 'pending':
    case 'in_progress':
    case 'transit':
      colorClasses = 'bg-tertiary-fixed text-on-tertiary-fixed-variant border border-tertiary/20';
      break;
    case 'critical':
    case 'error':
    case 'failed':
    case 'delayed':
      colorClasses = 'bg-error-container text-on-error-container border border-error/20';
      break;
    case 'info':
    case 'neutral':
    case 'inactive':
    default:
      colorClasses = 'bg-surface-container text-outline border border-outline-variant';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>
      {textLabel}
    </span>
  );
};

export default StatusBadge;
