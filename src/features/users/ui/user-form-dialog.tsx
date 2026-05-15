"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail, UserRound } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { BrandInputShell } from "@/components/ui/input-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authPrimaryButtonClassName } from "@/features/auth/constants";
import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import { PasswordVisibilityToggle } from "@/features/auth/ui/password-visibility-toggle";
import { useAdminUserAvatar } from "@/features/users/hooks/use-admin-user-avatar";
import { userInitials } from "@/features/users/lib/format-user";
import { SettingsProfileAvatarSection } from "@/features/settings/ui/settings-profile-avatar-section";
import {
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
} from "@/redux/api/users.api";
import type { TAdminUser } from "@/types/admin-user.type";
import { cn } from "@/lib/utils";
import {
  adminUserCreateSchema,
  adminUserUpdateSchema,
  type TAdminUserFormValues,
} from "@/validation/admin-user.schema";

type TUserFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: TAdminUser | null;
};

const defaultValues: TAdminUserFormValues = {
  name: "",
  email: "",
  role: "employee",
  status: "active",
  password: "",
  confirmPassword: "",
};

const formSelectTriggerClassName = "h-12 w-full rounded bg-background";

export function UserFormDialog({ open, onOpenChange, user }: TUserFormDialogProps) {
  const formId = useId();
  const isEdit = Boolean(user);
  const [showPassword, setShowPassword] = useState(false);
  const [isUploadingAfterCreate, setIsUploadingAfterCreate] = useState(false);
  const [createUser, { isLoading: isCreating }] = useCreateAdminUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateAdminUserMutation();

  const form = useForm<TAdminUserFormValues>({
    resolver: zodResolver(
      (isEdit ? adminUserUpdateSchema : adminUserCreateSchema) as never,
    ) as Resolver<TAdminUserFormValues>,
    defaultValues,
  });

  const avatar = useAdminUserAvatar({
    userId: user?._id ?? null,
    initialPhotoUrl: user?.profilePhotoUrl,
    disabled: false,
  });

  const watchedName = useWatch({ control: form.control, name: "name" });
  const avatarInitials = useMemo(
    () => userInitials(watchedName || user?.name || ""),
    [watchedName, user?.name],
  );

  const isSubmitting =
    isCreating || isUpdating || isUploadingAfterCreate || avatar.isLoading;

  useEffect(() => {
    if (!open) {
      void Promise.resolve().then(() => {
        setShowPassword(false);
        setIsUploadingAfterCreate(false);
        avatar.reset();
      });
      return;
    }
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status === "deleted" ? "inactive" : user.status,
        password: "",
        confirmPassword: "",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [open, user, form]);

  const handleOpenChange = (next: boolean) => {
    if (!next && isSubmitting) return;
    onOpenChange(next);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      if (isEdit && user) {
        const body: Record<string, unknown> = {
          name: values.name,
          email: values.email,
          role: values.role,
          status: values.status,
        };
        if (values.password?.trim()) {
          body.password = values.password.trim();
        }
        await updateUser({ id: user._id, body }).unwrap();
        toast.success("User updated", { description: `${values.name} was saved successfully.` });
      } else {
        const created = await createUser({
          name: values.name,
          email: values.email,
          password: values.password!.trim(),
          role: values.role,
          status: values.status,
        }).unwrap();

        if (avatar.hasPendingFile()) {
          setIsUploadingAfterCreate(true);
          try {
            await avatar.uploadPendingForUser(created.data._id);
          } finally {
            setIsUploadingAfterCreate(false);
          }
        }

        toast.success("User created", { description: `${values.name} can now sign in.` });
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(isEdit ? "Could not update user" : "Could not create user", {
        description: extractApiErrorMessage(err, "Please try again."),
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-w-lg gap-0 overflow-hidden p-0 sm:max-w-lg",
          "border-border/80 shadow-lg",
        )}
        showCloseButton={!isSubmitting}
        onPointerDownOutside={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
      >
        <Form {...form}>
          <form id={formId} className="flex flex-col" onSubmit={handleSubmit}>
            <div className="border-b border-border px-6 py-4">
              <DialogHeader className="space-y-1 pr-8">
                <DialogTitle className="text-lg font-semibold tracking-tight">
                  {isEdit ? "Edit user" : "Add user"}
                </DialogTitle>
                <DialogDescription>
                  {isEdit
                    ? "Update account details, role, and status."
                    : "Create a new team member with login credentials."}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="space-y-4 px-6 py-5">
              <SettingsProfileAvatarSection
                photoUrl={avatar.photoUrl}
                initials={avatarInitials}
                inputId={avatar.inputId}
                inputRef={avatar.inputRef}
                isUploading={avatar.isLoading || isUploadingAfterCreate}
                error={avatar.error}
                onPickClick={avatar.openPicker}
                onFileChange={avatar.onFileChange}
              />
              <FieldGroup className="gap-4">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${formId}-name`}>Full name</FieldLabel>
                      <BrandInputShell
                        {...field}
                        id={`${formId}-name`}
                        leading={<UserRound />}
                        autoComplete="name"
                        invalid={fieldState.invalid}
                        disabled={isSubmitting}
                        placeholder="Full name"
                      />
                      {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                    </Field>
                  )}
                />
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${formId}-email`}>Email</FieldLabel>
                      <BrandInputShell
                        {...field}
                        id={`${formId}-email`}
                        leading={<Mail />}
                        type="email"
                        autoComplete="email"
                        invalid={fieldState.invalid}
                        disabled={isSubmitting}
                        placeholder="you@company.com"
                      />
                      {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                    </Field>
                  )}
                />
                <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                  <Controller
                    name="role"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`${formId}-role`}>Role</FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger
                            id={`${formId}-role`}
                            className={formSelectTriggerClassName}
                            aria-invalid={fieldState.invalid || undefined}
                          >
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="employee">Employee</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                      </Field>
                    )}
                  />
                  <Controller
                    name="status"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={`${formId}-status`}>Status</FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger
                            id={`${formId}-status`}
                            className={formSelectTriggerClassName}
                            aria-invalid={fieldState.invalid || undefined}
                          >
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="blocked">Blocked</SelectItem>
                            <SelectItem value="banned">Banned</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${formId}-password`}>
                        {isEdit ? "New password (optional)" : "Password"}
                      </FieldLabel>
                      <BrandInputShell
                        {...field}
                        id={`${formId}-password`}
                        leading={<Lock />}
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        invalid={fieldState.invalid}
                        disabled={isSubmitting}
                        placeholder={isEdit ? "Leave blank to keep current" : "Enter password"}
                        trailing={
                          <PasswordVisibilityToggle
                            visible={showPassword}
                            onToggle={() => setShowPassword((v) => !v)}
                            labelVisible="Hide password"
                            labelHidden="Show password"
                          />
                        }
                      />
                      {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                    </Field>
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${formId}-confirm-password`}>
                        {isEdit ? "Confirm new password" : "Confirm password"}
                      </FieldLabel>
                      <BrandInputShell
                        {...field}
                        id={`${formId}-confirm-password`}
                        leading={<Lock />}
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        invalid={fieldState.invalid}
                        disabled={isSubmitting}
                        placeholder={
                          isEdit ? "Re-enter new password if changing" : "Re-enter password"
                        }
                        trailing={
                          <PasswordVisibilityToggle
                            visible={showPassword}
                            onToggle={() => setShowPassword((v) => !v)}
                            labelVisible="Hide password"
                            labelHidden="Show password"
                          />
                        }
                      />
                      {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border px-6 py-4 sm:flex-row sm:justify-end sm:gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleOpenChange(false)}
                className="h-10 w-full rounded-xs sm:w-auto sm:min-w-26"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "h-10 w-full gap-2 rounded-xs sm:w-auto sm:min-w-36",
                  authPrimaryButtonClassName,
                )}
              >
                {isSubmitting ? <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden /> : null}
                {isEdit ? "Save changes" : "Create user"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
