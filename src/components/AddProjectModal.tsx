
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project, ProjectStatus } from '@/types';
import { toast } from 'sonner';
import { useProjects } from '@/hooks/useProjects';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: Omit<Project, 'id' | 'created_at' | 'timeline'>) => Promise<void>;
  editors: string[];
  clients: string[];
}

const AddProjectModal = ({ isOpen, onClose, onAddProject, editors, clients }: AddProjectModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    assigned_editor: '',
    status: 'Pending' as ProjectStatus,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        client_name: '',
        assigned_editor: '',
        status: 'Pending',
      });
    }
  }, [isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.title || !formData.client_name || !formData.assigned_editor) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onAddProject(formData);
      toast.success('Project added successfully');
      onClose();
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to add project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>Fill in the details to create a new project.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input 
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter project title"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="client">Client *</Label>
              <Select 
                value={formData.client_name} 
                onValueChange={(value) => handleChange('client_name', value)}
              >
                <SelectTrigger id="client" className="flex-1">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client} value={client}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Use the "Add Client" button on the main page to add new clients.
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="editor">Assigned Editor *</Label>
              <Select 
                value={formData.assigned_editor} 
                onValueChange={(value) => handleChange('assigned_editor', value)}
              >
                <SelectTrigger id="editor" className="flex-1">
                  <SelectValue placeholder="Select editor" />
                </SelectTrigger>
                <SelectContent>
                  {editors.map((editor) => (
                    <SelectItem key={editor} value={editor}>
                      {editor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Use the "Add Editor" button on the main page to add new editors.
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange('status', value as ProjectStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Editing">Editing</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectModal;
