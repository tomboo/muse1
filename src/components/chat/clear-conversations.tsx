
'use client';

import { useState, useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { clearAllConversations } from '@/app/conversations/actions';
import { SidebarMenuButton } from '../ui/sidebar';

export function ClearConversations() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleClear = async () => {
    startTransition(async () => {
      const result = await clearAllConversations();
      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else {
        toast({
          title: 'Success',
          description: 'All conversations have been cleared.',
        });
        setIsDeleteDialogOpen(false);
      }
    });
  };

  return (
    <>
      <SidebarMenuButton
        onClick={() => setIsDeleteDialogOpen(true)}
        variant="ghost"
        className="w-full justify-start text-destructive hover:text-destructive"
        tooltip="Clear all chats"
      >
        <Trash2 />
        <span>Clear all chats</span>
      </SidebarMenuButton>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete all conversation history. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClear} className="bg-destructive hover:bg-destructive/90" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
