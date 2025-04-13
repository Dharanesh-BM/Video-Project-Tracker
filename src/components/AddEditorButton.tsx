
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { toast } from 'sonner';

export function AddEditorButton() {
  const [newEditor, setNewEditor] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { addEditorIfNew, refreshProjects } = useProjects();

  const handleAddNewEditor = async () => {
    if (!newEditor) {
      toast.error('Please enter an editor name');
      return;
    }
    
    try {
      await addEditorIfNew(newEditor);
      
      // Show success toast
      toast.success(`Added new editor: ${newEditor}`);
      
      // Reset new editor input and close popover
      setNewEditor('');
      setIsPopoverOpen(false);
      
      // Refresh the projects list to get updated editors
      refreshProjects();
    } catch (error) {
      console.error('Error adding editor:', error);
      toast.error('Failed to add editor');
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Editor
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Add New Editor</h4>
            <p className="text-sm text-muted-foreground">
              Enter the name of the new editor
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              value={newEditor}
              onChange={(e) => setNewEditor(e.target.value)}
              placeholder="New editor name"
            />
          </div>
          <Button 
            type="button" 
            onClick={handleAddNewEditor}
          >
            Add Editor
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
