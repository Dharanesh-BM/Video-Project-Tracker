
import { ProjectStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusStyles = (status: ProjectStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-status-pending/10 text-status-pending border-status-pending';
      case 'Editing':
        return 'bg-status-editing/10 text-status-editing border-status-editing';
      case 'Review':
        return 'bg-status-review/10 text-status-review border-status-review';
      case 'Completed':
        return 'bg-status-completed/10 text-status-completed border-status-completed';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <span
      className={cn(
        'px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getStatusStyles(status),
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
