
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { Project, ProjectFilter, ProjectStatus, TimelineEntry } from '@/types';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<ProjectFilter>({ status: 'All' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editors, setEditors] = useState<string[]>([]);
  const [clients, setClients] = useState<string[]>([]);
  const { user } = useAuth();

  // Fetch all projects
  const fetchProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Fetch projects from Supabase
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (projectsError) throw projectsError;
      
      // Fetch timelines for each project
      const projectsWithTimelines = await Promise.all(
        (projectsData ?? []).map(async (project) => {
          const { data: timelineData, error: timelineError } = await supabase
            .from('project_timeline')
            .select('*')
            .eq('project_id', project.id)
            .order('timestamp', { ascending: true });
          
          if (timelineError) throw timelineError;
          
          return {
            ...project,
            timeline: timelineData as TimelineEntry[]
          } as Project;
        })
      );
      
      setProjects(projectsWithTimelines);
      
      // Fetch unique editors
      const { data: editorsData, error: editorsError } = await supabase
        .from('editors')
        .select('name')
        .eq('user_id', user.id);
      
      if (editorsError) throw editorsError;
      
      // Fetch unique clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('name')
        .eq('user_id', user.id);
      
      if (clientsError) throw clientsError;
      
      const uniqueEditors = editorsData ? editorsData.map(editor => editor.name) : [];
      const uniqueClients = clientsData ? clientsData.map(client => client.name) : [];
      
      setEditors(uniqueEditors);
      setClients(uniqueClients);
      
      // Apply initial filters
      applyFilters(projectsWithTimelines, filters);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message || 'Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to projects
  const applyFilters = (projectData: Project[], projectFilters: ProjectFilter) => {
    let filtered = [...projectData];
    
    if (projectFilters.status && projectFilters.status !== 'All') {
      filtered = filtered.filter(project => project.status === projectFilters.status);
    }
    
    if (projectFilters.editor) {
      filtered = filtered.filter(project => project.assigned_editor === projectFilters.editor);
    }
    
    if (projectFilters.client) {
      filtered = filtered.filter(project => project.client_name === projectFilters.client);
    }
    
    setFilteredProjects(filtered);
  };

  // Update filters
  const updateFilters = (newFilters: Partial<ProjectFilter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    applyFilters(projects, updatedFilters);
  };

  // Add new project
  const addProject = async (newProjectData: Omit<Project, 'id' | 'created_at' | 'timeline'>) => {
    if (!user) return;
    
    try {
      // Insert the project into Supabase
      const { data: newProject, error: projectError } = await supabase
        .from('projects')
        .insert({
          title: newProjectData.title,
          client_name: newProjectData.client_name,
          assigned_editor: newProjectData.assigned_editor,
          status: newProjectData.status,
          user_id: user.id
        })
        .select()
        .single();
      
      if (projectError) throw projectError;
      
      // Timeline will be added by the database trigger
      
      // Fetch the new timeline for the project
      const { data: timelineData, error: timelineError } = await supabase
        .from('project_timeline')
        .select('*')
        .eq('project_id', newProject?.id)
        .order('timestamp', { ascending: true });
        
      if (timelineError) throw timelineError;
      
      const projectWithTimeline = {
        ...newProject,
        timeline: timelineData as TimelineEntry[]
      } as Project;
      
      // Update local state
      const updatedProjects = [projectWithTimeline, ...projects];
      setProjects(updatedProjects);
      
      // Add new client and editor to the Supabase tables if they don't exist
      await addClientIfNew(newProjectData.client_name);
      await addEditorIfNew(newProjectData.assigned_editor);
      
      applyFilters(updatedProjects, filters);
      
      toast.success('New project added successfully');
      
      return newProject?.id;
    } catch (err: any) {
      console.error('Error adding project:', err);
      toast.error(err.message || 'Failed to add project');
      throw err;
    }
  };

  // Add a new client if it doesn't exist
  const addClientIfNew = async (clientName: string) => {
    if (!user || !clientName.trim()) return;
    
    try {
      // Check if client exists first
      const { data, error: checkError } = await supabase
        .from('clients')
        .select('*')
        .eq('name', clientName)
        .eq('user_id', user.id);
      
      if (checkError) throw checkError;
      
      // If client doesn't exist, add it
      if (!data || data.length === 0) {
        const { error: insertError } = await supabase
          .from('clients')
          .insert({ name: clientName, user_id: user.id });
          
        if (insertError) throw insertError;
        
        // Update local state only if not already in the list
        if (!clients.includes(clientName)) {
          setClients(prev => [...prev, clientName]);
        }
        
        return true; // Successfully added
      }
      
      return false; // Already exists
    } catch (err: any) {
      console.error('Error adding client:', err);
      throw err;
    }
  };

  // Add a new editor if it doesn't exist
  const addEditorIfNew = async (editorName: string) => {
    if (!user || !editorName.trim()) return;
    
    try {
      // Check if editor exists first
      const { data, error: checkError } = await supabase
        .from('editors')
        .select('*')
        .eq('name', editorName)
        .eq('user_id', user.id);
      
      if (checkError) throw checkError;
      
      // If editor doesn't exist, add it
      if (!data || data.length === 0) {
        const { error: insertError } = await supabase
          .from('editors')
          .insert({ name: editorName, user_id: user.id });
          
        if (insertError) throw insertError;
        
        // Update local state only if not already in the list
        if (!editors.includes(editorName)) {
          setEditors(prev => [...prev, editorName]);
        }
        
        return true; // Successfully added
      }
      
      return false; // Already exists
    } catch (err: any) {
      console.error('Error adding editor:', err);
      throw err;
    }
  };

  // Update project status
  const updateProjectStatus = async (
    projectId: string, 
    newStatus: ProjectStatus, 
    comment?: string,
    updatedBy: string = 'Current User'
  ) => {
    if (!user) return;
    
    try {
      // Update the project status in Supabase
      const { error: updateError } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);
        
      if (updateError) throw updateError;
      
      // Add new timeline entry
      const { data: newEntry, error: timelineError } = await supabase
        .from('project_timeline')
        .insert({
          project_id: projectId,
          status: newStatus,
          comment: comment,
          updated_by: updatedBy
        })
        .select()
        .single();
        
      if (timelineError) throw timelineError;
      
      // Update the project in the local state
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            status: newStatus,
            timeline: [...project.timeline, newEntry as TimelineEntry]
          };
        }
        return project;
      });
      
      setProjects(updatedProjects);
      applyFilters(updatedProjects, filters);
      
      toast.success(`Project status updated to ${newStatus}`);
      
    } catch (err: any) {
      console.error('Error updating project status:', err);
      toast.error(err.message || 'Failed to update project status');
    }
  };

  // Load projects when user changes or on mount
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  // Listen for realtime updates on the projects table
  useEffect(() => {
    if (!user) return;
    
    const projectsSubscription = supabase
      .channel('public:projects')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' }, 
        () => {
          fetchProjects();
        }
      )
      .subscribe();
      
    const clientsSubscription = supabase
      .channel('public:clients')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'clients' }, 
        () => {
          fetchProjects();
        }
      )
      .subscribe();
      
    const editorsSubscription = supabase
      .channel('public:editors')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'editors' }, 
        () => {
          fetchProjects();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(projectsSubscription);
      supabase.removeChannel(clientsSubscription);
      supabase.removeChannel(editorsSubscription);
    };
  }, [user]);

  return { 
    projects: filteredProjects,
    loading, 
    error,
    filters,
    editors,
    clients,
    updateFilters,
    updateProjectStatus,
    refreshProjects: fetchProjects,
    addProject,
    addClientIfNew,
    addEditorIfNew
  };
}
