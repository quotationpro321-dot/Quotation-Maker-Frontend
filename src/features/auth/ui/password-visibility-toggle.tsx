"use client";

import { Eye, EyeOff } from "lucide-react";

type TPasswordVisibilityToggleProps = {
  visible: boolean;
  onToggle: () => void;
  labelVisible: string;
  labelHidden: string;
};

export function PasswordVisibilityToggle({
  visible,
  onToggle,
  labelVisible,
  labelHidden,
}: TPasswordVisibilityToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? labelVisible : labelHidden}
      aria-pressed={visible}
      className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors duration-(--motion-instant) hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/40"
    >
      {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );
}
