
export type ProjectStatus = 'Pending' | 'Editing' | 'Review' | 'Completed';

export interface TimelineEntry {
  id: string;
  status: ProjectStatus;
  comment?: string;
  timestamp: string;
  updated_by: string;
}

export interface Project {
  id: string;
  title: string;
  client_name: string;
  assigned_editor: string;
  status: ProjectStatus;
  created_at: string;
  timeline: TimelineEntry[];
}

export interface ProjectFilter {
  status?: ProjectStatus | 'All';
  editor?: string;
  client?: string;
}
