"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NormalizedSegment } from "@/features/flight-converter/types/flight-converter.types";

type SegmentEditCardProps = {
  segment: NormalizedSegment;
  index: number;
  onChange: (patch: Partial<NormalizedSegment>) => void;
};

export function SegmentEditCard({ segment, index, onChange }: SegmentEditCardProps) {
  return (
    <div className="rounded! border border-border bg-card p-4">
      <p className="mb-3 text-sm font-semibold">
        Segment {segment.segmentOrder} — {segment.flightNumber}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor={`flight-${index}`}>Flight number</Label>
          <Input
            id={`flight-${index}`}
            value={segment.flightNumber}
            onChange={(e) => onChange({ flightNumber: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`depart-${index}`}>Depart time</Label>
          <Input
            id={`depart-${index}`}
            value={segment.departureTime}
            onChange={(e) => onChange({ departureTime: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`arrive-${index}`}>Arrive display</Label>
          <Input
            id={`arrive-${index}`}
            value={segment.arrivalDisplay}
            onChange={(e) => onChange({ arrivalDisplay: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`from-code-${index}`}>From code</Label>
          <Input
            id={`from-code-${index}`}
            value={segment.fromCode}
            onChange={(e) => onChange({ fromCode: e.target.value.toUpperCase() })}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`from-name-${index}`}>From airport</Label>
          <Input
            id={`from-name-${index}`}
            value={segment.fromName}
            onChange={(e) => onChange({ fromName: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`to-code-${index}`}>To code</Label>
          <Input
            id={`to-code-${index}`}
            value={segment.toCode}
            onChange={(e) => onChange({ toCode: e.target.value.toUpperCase() })}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={`to-name-${index}`}>To airport</Label>
          <Input
            id={`to-name-${index}`}
            value={segment.toName}
            onChange={(e) => onChange({ toName: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
