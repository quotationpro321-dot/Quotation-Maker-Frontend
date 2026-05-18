import { cn } from "@/lib/utils";

type TAuthBrandProps = {
  className?: string;
  label?: string;
};

export function AuthBrand({ className, label = "ALSAMA" }: TAuthBrandProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="relative grid size-9 place-items-center rounded-full bg-secondary text-secondary-foreground">
        <span
          aria-hidden
          className="absolute inset-0 animate-auth-pulse-ring rounded-full border border-brand-primary/40"
        />
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="size-4 text-brand-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3l2.6 5.6L20 10l-4.2 3.7L17 20l-5-3-5 3 1.2-6.3L4 10l5.4-1.4L12 3z" />
        </svg>
      </span>
      <span className="text-sm font-semibold tracking-[0.18em] uppercase">
        {label}
      </span>
    </div>
  );
}
