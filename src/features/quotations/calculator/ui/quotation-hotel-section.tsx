"use client";

import { Hotel } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calculateHotelTotal,
  formatQuotationMoney,
} from "@/features/quotations/calculator/lib/calculate-quotation";
import {
  QuotationSectionHeader,
  quotationSectionBodyClass,
} from "@/features/quotations/calculator/ui/quotation-section-header";
import {
  HOTELS_HOLIDAY,
  HOTELS_MADINAH,
  HOTELS_MAKKAH,
} from "@/features/quotations/calculator/lib/quotation-calculator-defaults";
import type { TQuotationHotel, TQuotationOption } from "@/types/quotation.type";

type TQuotationHotelSectionProps = {
  option: TQuotationOption;
  currency: string;
  onChange: (patch: Partial<TQuotationOption>) => void;
};

const HOTEL_FIELDS = [
  { label: "Makkah hotel", field: "hotelMakkah", list: HOTELS_MAKKAH },
  { label: "Madinah hotel", field: "hotelMadinah", list: HOTELS_MADINAH },
  { label: "Holiday hotel", field: "hotelHoliday", list: HOTELS_HOLIDAY },
] as const;

export function QuotationHotelSection({
  option,
  currency,
  onChange,
}: TQuotationHotelSectionProps) {
  const hotelTotal = calculateHotelTotal(option);
  const displayHotelTotal = option.hotelSectionEnabled ? hotelTotal : 0;

  return (
    <Card className="rounded!">
      <QuotationSectionHeader
        icon={<Hotel className="size-5 text-brand-primary" />}
        title="Hotel accommodation"
        enabled={option.hotelSectionEnabled}
        onEnabledChange={(hotelSectionEnabled) => onChange({ hotelSectionEnabled })}
        priceLabel={formatQuotationMoney(displayHotelTotal, currency)}
      />
      <CardContent
        className={`space-y-4 ${quotationSectionBodyClass(option.hotelSectionEnabled)}`}
      >
        {HOTEL_FIELDS.map(({ label, field, list }) => {
          const hotel = option[field] as TQuotationHotel;
          return (
            <div
              key={field}
              className="grid gap-3 rounded! border border-border p-3 md:grid-cols-12"
            >
              <div className="space-y-2 md:col-span-5">
                <Label>{label}</Label>
                <Select
                  value={hotel.name}
                  onValueChange={(value) =>
                    onChange({ [field]: { ...hotel, name: value } })
                  }
                >
                  <SelectTrigger className="rounded!">
                    <SelectValue placeholder="Select hotel" />
                  </SelectTrigger>
                  <SelectContent>
                    {list.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-4">
                <Label>Room type</Label>
                <Input
                  value={hotel.roomType}
                  onChange={(e) =>
                    onChange({ [field]: { ...hotel, roomType: e.target.value } })
                  }
                  placeholder="e.g. Double"
                  className="rounded!"
                />
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label>Cost</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={hotel.cost || ""}
                  onChange={(e) =>
                    onChange({
                      [field]: {
                        ...hotel,
                        cost: Number.parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="rounded!"
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
