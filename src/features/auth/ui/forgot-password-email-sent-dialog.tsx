"use client";

import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TForgotPasswordEmailSentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emailDisplay: string;
};

export function ForgotPasswordEmailSentDialog({
  open,
  onOpenChange,
  emailDisplay,
}: TForgotPasswordEmailSentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-2rem)] gap-0 rounded-md border border-border bg-background p-6 text-foreground shadow-lg ring-1 ring-border/60 sm:max-w-md"
      >
        <DialogHeader className="items-center text-center sm:text-center">
          <div
            className="mb-5 grid size-14 place-items-center rounded-full border border-brand-primary bg-brand-primary/10 text-brand-primary"
            aria-hidden
          >
            <Mail className="size-7 stroke-[2.25]" />
          </div>
          <DialogTitle className="font-sans text-2xl font-semibold tracking-tight text-brand-primary">
            Check your email
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed text-muted-foreground">
            We&apos;ve sent a verification link to{" "}
            <span className="font-semibold text-secondary">{emailDisplay}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 rounded-md border border-border/60 bg-muted/40 p-4 text-center text-sm leading-relaxed text-muted-foreground dark:bg-muted/30">
          Check your email for a verification link. Please check your spam
          folder too.
        </div>

        <div className="mt-6 flex justify-center">
          <DialogClose asChild>
            <Button variant="secondary" size="lg" className="min-w-32 rounded">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
