"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

export function AppToaster() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{
        classNames: {
          toast: "shadow-lg",
        },
      }}
    />
  );
}
