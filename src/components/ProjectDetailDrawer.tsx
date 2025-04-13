
import { Project } from '@/types';
import { format } from 'date-fns';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ProjectTimeline from './ProjectTimeline';

interface ProjectDetailDrawerProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailDrawer = ({ project, isOpen, onClose }: ProjectDetailDrawerProps) => {
  if (!project) return null;

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[85vh] overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <div className="flex items-start justify-between">
              <div>
                <DrawerTitle className="text-xl">{project.title}</DrawerTitle>
                <DrawerDescription className="mt-1">
                  Client: {project.client_name}
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          
          <div className="p-4 pb-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Editor</h3>
                <p>{project.assigned_editor}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <StatusBadge status={project.status} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                <p>{format(new Date(project.created_at), 'MMMM d, yyyy')}</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium">Project Timeline</h3>
              <div className="border rounded-md p-4">
                <ProjectTimeline timeline={project.timeline} />
              </div>
            </div>
          </div>
          
          <DrawerFooter>
            <Button onClick={onClose} className="w-full">Close</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProjectDetailDrawer;
