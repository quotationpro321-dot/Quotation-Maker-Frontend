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
import { authPrimaryButtonClassName } from "@/features/auth/constants";
import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import { useRestoreAdminUserMutation } from "@/redux/api/users.api";
import type { TAdminUser } from "@/types/admin-user.type";
import { cn } from "@/lib/utils";

type TRestoreUserDialogProps = {
  user: TAdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestored?: () => void;
};

export function RestoreUserDialog({
  user,
  open,
  onOpenChange,
  onRestored,
}: TRestoreUserDialogProps) {
  const [restoreUser, { isLoading }] = useRestoreAdminUserMutation();

  const handleRestore = async () => {
    if (!user) return;
    try {
      await restoreUser(user._id).unwrap();
      toast.success("User restored", {
        description: `${user.name} can sign in again with their previous password.`,
      });
      onOpenChange(false);
      onRestored?.();
    } catch (err) {
      toast.error("Could not restore user", {
        description: extractApiErrorMessage(err, "Please try again."),
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isLoading && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore user?</AlertDialogTitle>
          <AlertDialogDescription>
            {user
              ? `${user.name} (${user.email}) will be active again and can sign in. Their password is unchanged. Use Edit to set a new password if needed. Restore is only available for 60 days after removal.`
              : "This will reactivate the account."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            disabled={isLoading}
            className={cn("gap-2", authPrimaryButtonClassName)}
            onClick={() => void handleRestore()}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Restore
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
