import { ShieldCheck } from "lucide-react";

type TAuthFormFooterNoteProps = {
  children: React.ReactNode;
};

export function AuthFormFooterNote({ children }: TAuthFormFooterNoteProps) {
  return (
    <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
      <ShieldCheck className="size-3.5 text-brand-secondary" aria-hidden />
      {children}
    </p>
  );
}
