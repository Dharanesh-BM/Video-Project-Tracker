
import { TimelineEntry } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import StatusBadge from './StatusBadge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectTimelineProps {
  timeline: TimelineEntry[];
}

const ProjectTimeline = ({ timeline }: ProjectTimelineProps) => {
  return (
    <ScrollArea className="h-[300px] w-full pr-4">
      <div className="space-y-4 py-2">
        {timeline.length === 0 ? (
          <p className="text-center text-muted-foreground">No timeline entries yet</p>
        ) : (
          [...timeline]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map((entry, index) => (
              <div
                key={entry.id}
                className="relative pl-6 pb-4 border-l border-gray-200 last:border-l-transparent"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-0 -translate-x-1/2 h-3 w-3 rounded-full bg-gray-200" />
                
                <div className="flex items-center space-x-2">
                  <StatusBadge status={entry.status} />
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                  </span>
                </div>
                
                {entry.comment && (
                  <p className="mt-1 text-sm text-gray-600">{entry.comment}</p>
                )}
                
                <p className="mt-1 text-xs text-muted-foreground">By {entry.updated_by}</p>
              </div>
            ))
        )}
      </div>
    </ScrollArea>
  );
};

export default ProjectTimeline;
