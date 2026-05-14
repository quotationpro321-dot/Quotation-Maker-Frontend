"use client";

import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type TAuthHeroImage = {
  src: string;
  alt?: string;
};

type TAuthHeroProps = {
  className?: string;
  images?: TAuthHeroImage[];
  intervalMs?: number;
};

const DEFAULT_IMAGES: TAuthHeroImage[] = [
  {
    src: "/auth/01-mecca-grand-mosque.jpg",
    alt: "Aerial view of the Grand Mosque and Mecca, Saudi Arabia",
  },
  {
    src: "/auth/02-masjid-al-haram.jpg",
    alt: "Panorama of Masjid al-Haram with the Holy Kaaba",
  },
  {
    src: "/auth/03-kaaba-door.jpg",
    alt: "Door of the Holy Kaaba and Maqam Ibrahim in the Grand Mosque",
  },
  {
    src: "/auth/04-prophet-mosque.jpg",
    alt: "Skyline of Madinah with the Prophet's Mosque",
  },
  {
    src: "/auth/05-green-dome.jpg",
    alt: "Green Dome and minaret of the Prophet's Mosque in Madinah",
  },
];

const navBtn =
  "top-1/2 h-8 w-8 -translate-y-1/2 border-brand-primary/70 bg-brand-primary text-white hover:bg-brand-primary-700 hover:text-white disabled:border-brand-primary/30 disabled:bg-brand-primary/40 disabled:text-white/70 dark:border-brand-primary/70 dark:bg-brand-primary dark:hover:bg-brand-primary-700 dark:hover:text-white dark:disabled:border-brand-primary/30 dark:disabled:bg-brand-primary/40 dark:disabled:text-white/70";

export function AuthHero({
  className,
  images = DEFAULT_IMAGES,
  intervalMs = 5000,
}: TAuthHeroProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || images.length <= 1) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const id = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [api, images.length, intervalMs]);

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-l-lg",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 flex items-center justify-center p-10">
        <div className="relative aspect-3/4 w-full max-w-[520px] overflow-hidden rounded-t-[280px] rounded-b-lg bg-surface-base shadow-[0_40px_120px_-40px_rgba(36,89,95,0.6)]">
          <Carousel
            setApi={setApi}
            opts={{ loop: true, align: "start" }}
            className="h-full w-full"
          >
            <CarouselContent className="ml-0 h-full">
              {images.map((image, index) => (
                <CarouselItem
                  key={image.src}
                  className="h-full basis-full pl-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt ?? ""}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className={cn(
                      "h-full w-full object-cover transition-transform duration-700",
                      index === activeIndex ? "animate-auth-ken-burns" : "",
                    )}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious
              variant="outline"
              size="icon-sm"
              className={cn("left-4", navBtn)}
            />
            <CarouselNext
              variant="outline"
              size="icon-sm"
              className={cn("right-4", navBtn)}
            />
          </Carousel>

          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-2">
            {images.map((image, index) => (
              <span
                key={`${image.src}-dot`}
                className={cn(
                  "h-1.5 rounded-full bg-white transition-all duration-(--motion-fast)",
                  index === activeIndex ? "w-5" : "w-1.5 opacity-60",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
