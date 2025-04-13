
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { toast } from 'sonner';

export function AddClientButton() {
  const [newClient, setNewClient] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { addClientIfNew, refreshProjects } = useProjects();

  const handleAddNewClient = async () => {
    if (!newClient) {
      toast.error('Please enter a client name');
      return;
    }
    
    try {
      await addClientIfNew(newClient);
      
      // Show success toast
      toast.success(`Added new client: ${newClient}`);
      
      // Reset new client input and close popover
      setNewClient('');
      setIsPopoverOpen(false);
      
      // Refresh the projects list to get updated clients
      refreshProjects();
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
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
          Add Client
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Add New Client</h4>
            <p className="text-sm text-muted-foreground">
              Enter the name of the new client
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
              placeholder="New client name"
            />
          </div>
          <Button 
            type="button" 
            onClick={handleAddNewClient}
          >
            Add Client
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
