
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Project, ProjectStatus } from '@/types';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';
import UpdateStatusModal from './UpdateStatusModal';
import ProjectDetailDrawer from './ProjectDetailDrawer';

interface ProjectTableProps {
  projects: Project[];
  loading: boolean;
  onUpdateStatus: (projectId: string, newStatus: ProjectStatus, comment?: string) => Promise<void>;
}

const ProjectTable = ({ projects, loading, onUpdateStatus }: ProjectTableProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  
  const handleOpenStatusModal = (project: Project) => {
    setSelectedProject(project);
    setStatusModalOpen(true);
  };
  
  const handleCloseStatusModal = () => {
    setStatusModalOpen(false);
    setSelectedProject(null);
  };
  
  const handleOpenDetailDrawer = (project: Project) => {
    setSelectedProject(project);
    setDetailDrawerOpen(true);
  };
  
  const handleCloseDetailDrawer = () => {
    setDetailDrawerOpen(false);
    setSelectedProject(null);
  };
  
  if (loading) {
    return (
      <div className="w-full text-center py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded w-full"></div>
          <div className="h-6 bg-gray-200 rounded w-full"></div>
          <div className="h-6 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
  if (projects.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">No projects found matching the current filters.</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Project</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Editor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <button 
                    className="hover:text-purple-600 transition-colors text-left"
                    onClick={() => handleOpenDetailDrawer(project)}
                  >
                    {project.title}
                  </button>
                </TableCell>
                <TableCell>{project.client_name}</TableCell>
                <TableCell>{project.assigned_editor}</TableCell>
                <TableCell>
                  <StatusBadge status={project.status} />
                </TableCell>
                <TableCell>
                  {format(new Date(project.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleOpenStatusModal(project)}
                  >
                    Update Status
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <UpdateStatusModal
        project={selectedProject}
        isOpen={statusModalOpen}
        onClose={handleCloseStatusModal}
        onUpdateStatus={onUpdateStatus}
      />
      
      <ProjectDetailDrawer
        project={selectedProject}
        isOpen={detailDrawerOpen}
        onClose={handleCloseDetailDrawer}
      />
    </>
  );
};

export default ProjectTable;
