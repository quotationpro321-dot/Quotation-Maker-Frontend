import type { Metadata } from "next";
import { Inter, Raleway } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReduxProvider from "@/providers/redux.provider";
import { ThemeProvider } from "@/providers/theme.provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "ALSAMA Dashboard",
  description: "Internal dashboard for the ALSAMA team.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <ReduxProvider>
          <TooltipProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </TooltipProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
