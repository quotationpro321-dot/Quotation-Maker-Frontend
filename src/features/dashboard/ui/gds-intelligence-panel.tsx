import Link from "next/link";
import { ArrowRight, Plane, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TGdsIntelligencePanelProps = {
  flightConverterHref: string;
};

export function GdsIntelligencePanel({
  flightConverterHref,
}: TGdsIntelligencePanelProps) {
  return (
    <Card className="h-full rounded! border-brand-primary/20 bg-brand-primary text-white shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded! bg-white/15">
              <Plane className="size-5" aria-hidden />
            </div>
            <CardTitle className="text-lg text-white">GDS Intelligence</CardTitle>
          </div>
          <Badge className="rounded! border-white/20 bg-white/10 text-white hover:bg-white/10">
            <Sparkles className="mr-1 size-3" aria-hidden />
            AI parser active
          </Badge>
        </div>
        <CardDescription className="text-white/75">
          Drop your raw Amadeus or Galileo itinerary here for instant conversion
          into a client-ready quotation layout.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded! border border-white/15 bg-white/5 p-4 text-sm text-white/80">
          Paste itinerary text in the flight converter to generate structured
          segments, preview output, and export PNG or PDF.
        </div>
        <Button
          asChild
          className="w-full rounded! border-transparent bg-white text-brand-primary hover:bg-white/90 hover:text-brand-primary"
        >
          <Link href={flightConverterHref}>
            Open Flight Converter
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
