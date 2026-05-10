import type { Metadata } from "next";

import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { AuthHero } from "@/components/auth/auth-hero";
import AlsamaLogo from "@/components/common/AlsamaLogo";
import { AnimatedThemeToggler } from "@/registry/magicui/animated-theme-toggler";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to the ALSAMA dashboard. Restricted to authorized team members.",
};

export default function LoginPage() {
  return (
    <main className="relative grid min-h-screen w-full lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <section className="relative grid min-h-screen grid-rows-[auto_1fr_auto] px-6 py-10 sm:px-12 lg:px-16 xl:px-24">
        <div className="flex items-center justify-between gap-3 animate-in fade-in-50 slide-in-from-top-2 duration-500">
          <AlsamaLogo />
          <AnimatedThemeToggler variant="circle" />
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-full max-w-md space-y-3 animate-in fade-in-50 slide-in-from-bottom-2 duration-700">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              Welcome, <span className="text-brand-secondary">Dashboard</span>
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              Log in to manage Umrah bookings, package availability, team
              schedules, and pilgrim inquiries, all from one dashboard.
            </p>
          </div>

          <div className="mt-10 w-full max-w-md">
            <AdminLoginForm />
          </div>
        </div>

        <footer className="text-copy-right text-sm w-full flex items-center justify-center text-center gap-1">
          <p>© {new Date().getFullYear()} </p>
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
