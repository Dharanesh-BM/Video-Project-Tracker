
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ProjectFilter, ProjectStatus } from '@/types';

interface FilterBarProps {
  filters: ProjectFilter;
  onFilterChange: (newFilters: Partial<ProjectFilter>) => void;
  editors: string[];
  clients: string[];
}

const FilterBar = ({ filters, onFilterChange, editors, clients }: FilterBarProps) => {
  const statusOptions: (ProjectStatus | 'All')[] = ['All', 'Pending', 'Editing', 'Review', 'Completed'];
  
  return (
    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-6">
      <div className="w-full md:w-1/3">
        <label className="text-sm font-medium mb-1 block text-gray-700">Status</label>
        <Select
          value={filters.status || 'All'}
          onValueChange={(value) => onFilterChange({ status: value as ProjectStatus | 'All' })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-1/3">
        <label className="text-sm font-medium mb-1 block text-gray-700">Editor</label>
        <Select
          value={filters.editor || 'all_editors'}
          onValueChange={(value) => onFilterChange({ editor: value === 'all_editors' ? undefined : value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by editor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_editors">All editors</SelectItem>
            {editors.map((editor) => (
              <SelectItem key={editor} value={editor}>
                {editor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-1/3">
        <label className="text-sm font-medium mb-1 block text-gray-700">Client</label>
        <Select
          value={filters.client || 'all_clients'}
          onValueChange={(value) => onFilterChange({ client: value === 'all_clients' ? undefined : value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_clients">All clients</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client} value={client}>
                {client}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
