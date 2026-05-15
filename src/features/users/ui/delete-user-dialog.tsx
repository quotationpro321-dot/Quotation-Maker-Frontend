"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import { useDeleteAdminUserMutation } from "@/redux/api/users.api";
import type { TAdminUser } from "@/types/admin-user.type";

type TDeleteUserDialogProps = {
  user: TAdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteUserDialog({ user, open, onOpenChange }: TDeleteUserDialogProps) {
  const [deleteUser, { isLoading }] = useDeleteAdminUserMutation();

  const handleDelete = async () => {
    if (!user) return;
    try {
      await deleteUser(user._id).unwrap();
      toast.success("User deleted", {
        description: `${user.name} has been removed from the directory.`,
      });
      onOpenChange(false);
    } catch (err) {
      toast.error("Could not delete user", {
        description: extractApiErrorMessage(err, "Please try again."),
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isLoading && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user?</AlertDialogTitle>
          <AlertDialogDescription>
            {user
              ? `This will remove ${user.name} (${user.email}) from active users. They will no longer be able to sign in.`
              : "This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoading}
            className="gap-2"
            onClick={() => void handleDelete()}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
