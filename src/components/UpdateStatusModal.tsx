
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Project, ProjectStatus } from '@/types';
import StatusBadge from './StatusBadge';
import ProjectTimeline from './ProjectTimeline';

interface UpdateStatusModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (projectId: string, newStatus: ProjectStatus, comment?: string) => Promise<void>;
}

const UpdateStatusModal = ({ project, isOpen, onClose, onUpdateStatus }: UpdateStatusModalProps) => {
  const [status, setStatus] = useState<ProjectStatus | ''>('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const statusOptions: ProjectStatus[] = ['Pending', 'Editing', 'Review', 'Completed'];
  
  const handleSubmit = async () => {
    if (!project || !status) return;
    
    setIsSubmitting(true);
    
    try {
      await onUpdateStatus(project.id, status, comment);
      setStatus('');
      setComment('');
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        {project && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Update Project Status</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-1">Client: {project.client_name}</p>
                <p className="text-sm text-muted-foreground mb-2">Editor: {project.assigned_editor}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Current status:</span>
                  <StatusBadge status={project.status} />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">New Status</label>
                  <Select value={status} onValueChange={(value) => setStatus(value as ProjectStatus)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          <div className="flex items-center space-x-2">
                            <span>{option}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Comment (optional)</label>
                  <Textarea
                    placeholder="Add a comment about this status change..."
                    className="resize-none"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Timeline History</h4>
                <ProjectTimeline timeline={project.timeline} />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!status || isSubmitting || status === project.status}
              >
                {isSubmitting ? 'Updating...' : 'Update Status'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusModal;
