"use client";

import * as React from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  tabsListVariants,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type ReusableTabItem = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
};

/** `compact`: full-width bar, triggers hug content. `stretch`: equal columns. */
export type ReusableTabsListLayout = "compact" | "stretch";

export type ReusableTabsProps = {
  tabs: ReusableTabItem[];
  defaultValue?: string;
  className?: string;
  tabsClassName?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  tabLayout?: ReusableTabsListLayout;
  tabsListVariant?: React.ComponentProps<typeof TabsList>["variant"];
};

const activeTrigger =
  "gap-2 text-foreground/80 data-active:bg-brand-primary data-active:text-white data-active:shadow-sm data-active:hover:text-white dark:text-muted-foreground dark:data-active:border-transparent dark:data-active:bg-brand-primary dark:data-active:text-white dark:data-active:shadow-sm dark:data-active:hover:text-white";

export function ReusableTabs({
  tabs,
  defaultValue,
  className,
  tabsClassName,
  listClassName,
  triggerClassName,
  contentClassName,
  tabLayout = "compact",
  tabsListVariant = "default",
}: ReusableTabsProps) {
  const initial = defaultValue ?? tabs[0]?.value ?? "tab";

  return (
    <Tabs defaultValue={initial} className={cn("w-full space-y-4", tabsClassName, className)}>
      <TabsList
        variant={tabsListVariant}
        className={cn(
          tabsListVariants({ variant: tabsListVariant }),
          tabLayout === "compact" &&
            "h-auto min-h-9 w-fit! max-w-full flex-wrap justify-start gap-1.5 p-1",
          tabLayout === "stretch" &&
            "h-auto min-h-9 grid! w-full! max-w-full gap-1 p-1 *:data-[slot=tabs-trigger]:min-w-0",
          listClassName,
        )}
        style={
          tabLayout === "stretch"
            ? { gridTemplateColumns: `repeat(${Math.max(tabs.length, 1)}, minmax(0, 1fr))` }
            : undefined
        }
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              tabLayout === "compact" &&
                "flex-none! grow-0! shrink-0! basis-auto px-3 py-1.5 whitespace-nowrap shadow-none",
              tabLayout === "stretch" && "min-w-0 truncate",
              activeTrigger,
              triggerClassName,
            )}
          >
            {tab?.icon ?? null}
            {tab?.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className={cn("mt-0 outline-none", contentClassName)}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
