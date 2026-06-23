"use client";

import { usePathname } from "next/navigation";

function hrefPathname(href: string): string {
  const withoutHash = href.split("#")[0] ?? href;
  const withoutQuery = withoutHash.split("?")[0] ?? withoutHash;
  return withoutQuery.endsWith("/") && withoutQuery.length > 1
    ? withoutQuery.slice(0, -1)
    : withoutQuery;
}

export function useNavActive(href: string, exact = false): boolean {
  const pathname = usePathname();
  const targetPath = hrefPathname(href);

  if (!pathname) return false;
  if (exact) return pathname === targetPath;
  return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
}
