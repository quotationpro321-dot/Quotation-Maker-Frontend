"use client";

import { usePathname } from "next/navigation";

export function useNavActive(href: string, exact = false): boolean {
  const pathname = usePathname();

  if (!pathname) return false;
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
