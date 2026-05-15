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
import { useBulkDeleteAdminUsersMutation } from "@/redux/api/users.api";
import type { TAdminUser } from "@/types/admin-user.type";

type TDeleteUsersBulkDialogProps = {
  users: TAdminUser[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};

export function DeleteUsersBulkDialog({
  users,
  open,
  onOpenChange,
  onDeleted,
}: TDeleteUsersBulkDialogProps) {
  const [bulkDelete, { isLoading }] = useBulkDeleteAdminUsersMutation();
  const count = users.length;

  const handleDelete = async () => {
    if (count === 0) return;

    try {
      const result = await bulkDelete({ ids: users.map((u) => u._id) }).unwrap();
      const { deleted, failed } = result.data;

      if (deleted.length > 0) {
        toast.success(
          deleted.length === 1 ? "User deleted" : `${deleted.length} users deleted`,
          {
            description:
              failed.length > 0
                ? `${failed.length} account${failed.length === 1 ? "" : "s"} could not be removed.`
                : "Selected accounts can no longer sign in.",
          },
        );
        onDeleted();
        onOpenChange(false);
        return;
      }

      toast.error("Could not delete users", {
        description: failed[0]?.message ?? "Please try again.",
      });
    } catch (err) {
      toast.error("Could not delete users", {
        description: extractApiErrorMessage(err, "Please try again."),
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isLoading && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {count} user{count === 1 ? "" : "s"}?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Selected accounts will be removed from the active directory and will no longer be
                able to sign in.
              </p>
              {count <= 5 ? (
                <ul className="list-inside list-disc space-y-0.5">
                  {users.map((u) => (
                    <li key={u._id}>
                      {u.name} ({u.email})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  Including {users[0]?.name}, {users[1]?.name}, and {count - 2} more.
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoading || count === 0}
            className="gap-2"
            onClick={() => void handleDelete()}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Delete {count} user{count === 1 ? "" : "s"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
