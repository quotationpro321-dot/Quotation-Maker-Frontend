"use client";

import { Loader2, Mail, MailIcon, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import { useForgotPasswordMutation } from "@/redux/api/auth.api";

type ForgotPasswordFormProps = {
  defaultEmail?: string;
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const errorObj = error as {
      data?: { message?: string } | string;
      message?: string;
    };
    if (typeof errorObj.data === "string") return errorObj.data;
    if (errorObj.data && typeof errorObj.data.message === "string") {
      return errorObj.data.message;
    }
    if (typeof errorObj.message === "string") return errorObj.message;
  }
  return "Could not send reset link. Please try again.";
};

export function ForgotPasswordForm({
  defaultEmail = "mdafsar99009@gmail.com",
}: ForgotPasswordFormProps) {
  const formId = useId();
  const [forgotPassword] = useForgotPasswordMutation();
  const [email, setEmail] = useState(defaultEmail);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  /** Email shown in success dialog (fixed at submit time). */
  const [sentToEmail, setSentToEmail] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Use a valid email address.");
      return;
    }

    setError(undefined);
    setIsPending(true);
    try {
      await forgotPassword({ email: trimmedEmail }).unwrap();
      setSentToEmail(trimmedEmail);
      setIsSuccessOpen(true);
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5"
        noValidate
      >
        <InputField
          id={`${formId}-email`}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          error={error}
          required
          autoFocus
          leading={<Mail className="size-4" aria-hidden />}
        />

        <div className="grid grid-cols-2 gap-3">
          <Button
            asChild
            className="h-11 rounded-xs bg-[#204F54] text-white hover:bg-[#1b4347]"
          >
            <Link href="/auth/login">Back</Link>
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="h-11 rounded-xs bg-[#204F54] text-white hover:bg-[#1b4347]"
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Sending...
              </span>
            ) : (
              "Next"
            )}
          </Button>
        </div>

        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-brand-secondary" aria-hidden />
          Reset instructions are sent securely.
        </p>
      </form>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[calc(100%-2rem)] gap-0 rounded-md border border-border bg-background p-6 text-foreground shadow-lg ring-1 ring-border/60 sm:max-w-md"
        >
          <DialogHeader className="items-center text-center sm:text-center">
            <div
              className="grid size-14 place-items-center rounded-full border border-brand-primary bg-brand-primary/10 text-brand-primary mb-5"
              aria-hidden
            >
              <MailIcon className="size-7 stroke-[2.25]" />
            </div>
            <DialogTitle className="font-sans text-2xl font-semibold tracking-tight text-brand-primary">
              Check your email
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-muted-foreground">
              We&apos;ve sent a verification link to{" "}
              <span className="font-semibold text-secondary">
                {sentToEmail || email.trim()}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 rounded-md border border-border/60 bg-muted/40 p-4 text-center text-sm leading-relaxed text-muted-foreground dark:bg-muted/30">
            Check your email for a verification link. Please check your spam
            folder too.
          </div>

          <div className="mt-6 flex justify-center">
            <DialogClose asChild>
              <Button
                variant="secondary"
                size="lg"
                className="min-w-32 rounded"
              >
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
