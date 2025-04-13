import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/useProjects';
import FilterBar from '@/components/FilterBar';
import ProjectTable from '@/components/ProjectTable';
import { RefreshCw, PlusCircle, LogOut } from 'lucide-react';
import AddProjectModal from '@/components/AddProjectModal';
import { useAuth } from '@/hooks/useAuth';
import { AddClientButton } from '@/components/AddClientButton';
import { AddEditorButton } from '@/components/AddEditorButton';
import { Project } from '@/types';

const Index = () => {
  const { 
    projects, 
    loading, 
    filters, 
    editors, 
    clients,
    updateFilters, 
    updateProjectStatus,
    refreshProjects,
    addProject
  } = useProjects();
  
  const { signOut } = useAuth();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProjects();
    setTimeout(() => setIsRefreshing(false), 500); // Add a small delay for better UX
  };
  
  const handleLogout = async () => {
    await signOut();
  };
  
  // Create a wrapper function that matches the expected void return type
  const handleAddProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'timeline'>) => {
    await addProject(projectData);
    // No return value needed, which makes this Promise<void>
  };
  
  return (
    <div className="container py-8 mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Video Project Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your video production projects
          </p>
        </div>
        
        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full md:w-auto"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw 
              className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} 
            />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          <Button 
            variant="default"
            size="sm"
            className="w-full md:w-auto bg-purple-600 hover:bg-purple-700"
            onClick={() => setAddProjectModalOpen(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Project
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            className="w-full md:w-auto"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <FilterBar 
          filters={filters} 
          onFilterChange={updateFilters} 
          editors={editors} 
          clients={clients} 
        />
        
        <div className="flex space-x-2">
          <AddClientButton />
          <AddEditorButton />
        </div>
      </div>
      
      <ProjectTable 
        projects={projects} 
        loading={loading} 
        onUpdateStatus={updateProjectStatus} 
      />
      
      <AddProjectModal 
        isOpen={addProjectModalOpen} 
        onClose={() => setAddProjectModalOpen(false)}
        onAddProject={handleAddProject}
        editors={editors}
        clients={clients}
      />
    </div>
  );
};

export default Index;
