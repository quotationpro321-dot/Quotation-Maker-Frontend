import AlsamaLogo from "@/components/common/AlsamaLogo";
import { AnimatedThemeToggler } from "@/registry/magicui/animated-theme-toggler";

import { AuthHero } from "./auth-hero";

/**
 * Split auth shell (main column + hero). Used once from `app/auth/layout.tsx`;
 * route `page.tsx` files only supply the middle content.
 */
type TAuthSplitLayoutProps = {
  children: React.ReactNode;
};

export function AuthSplitLayout({ children }: TAuthSplitLayoutProps) {
  const year = new Date().getFullYear();

  return (
    <main className="relative grid min-h-screen w-full lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <section className="relative grid min-h-screen grid-rows-[auto_1fr_auto] px-6 py-10 sm:px-12 lg:px-16 xl:px-24">
        <div className="flex items-center justify-between gap-3 animate-in fade-in-50 slide-in-from-top-2 duration-500">
          <AlsamaLogo />
          <AnimatedThemeToggler variant="circle" />
        </div>

        {children}

        <footer className="text-copy-right flex w-full items-center justify-center gap-1 text-center text-sm">
          <p>© {year} </p>
          <p className="font-semibold text-brand-primary">Alsama</p>
          <p>All rights reserved.</p>
        </footer>
      </section>

      <aside className="relative hidden overflow-hidden border-l border-white/10 lg:block">
        <div className="absolute inset-0 bg-linear-to-br from-brand-primary via-[#1f4f55] to-[#17383d]" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/auth/pattern.svg')",
            backgroundSize: "80px 80px",
            backgroundRepeat: "repeat",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/35"
        />
        <AuthHero className="relative z-10" />
      </aside>
    </main>
  );
}
