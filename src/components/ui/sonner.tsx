"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import { cn } from "@/lib/utils";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      closeButton
      duration={4500}
      icons={{
        success: <CircleCheckIcon className="size-4 text-brand-primary" aria-hidden />,
        info: <InfoIcon className="size-4 text-brand-primary" aria-hidden />,
        warning: <TriangleAlertIcon className="size-4 text-brand-secondary" aria-hidden />,
        error: <OctagonXIcon className="size-4 text-destructive" aria-hidden />,
        loading: <Loader2Icon className="size-4 animate-spin text-brand-primary" aria-hidden />,
      }}
      toastOptions={{
        classNames: {
          toast: cn(
            "group/toast border border-border bg-popover text-popover-foreground shadow-lg backdrop-blur-sm",
            "rounded-lg",
          ),
          title: "font-semibold text-foreground",
          description: "text-muted-foreground text-sm leading-snug",
          closeButton:
            "border-border bg-background text-foreground/80 hover:bg-muted hover:text-foreground",
          success: cn(
            "border-brand-primary/35 bg-brand-primary/10 dark:bg-brand-primary/20",
            "[&_[data-icon]]:text-brand-primary",
          ),
          error: cn(
            "border-destructive/40 bg-destructive/10 dark:bg-destructive/15",
            "[&_[data-icon]]:text-destructive",
          ),
          warning: cn(
            "border-brand-secondary/45 bg-brand-secondary/15 dark:bg-brand-secondary/20",
            "[&_[data-icon]]:text-brand-secondary",
          ),
          info: cn(
            "border-brand-primary/25 bg-brand-primary/5 dark:bg-brand-primary/10",
            "[&_[data-icon]]:text-brand-primary",
          ),
          loading: "border-brand-primary/30 bg-muted/80 [&_[data-icon]]:text-brand-primary",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
