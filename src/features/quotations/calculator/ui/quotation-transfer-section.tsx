"use client";

import { MapPin, Plus, PlusCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { formatQuotationMoney } from "@/features/quotations/calculator/lib/calculate-quotation";
import { TRANSFER_LOCATIONS } from "@/features/quotations/calculator/lib/quotation-calculator-defaults";
import {
  QuotationSectionHeader,
  quotationSectionBodyClass,
} from "@/features/quotations/calculator/ui/quotation-section-header";
import type { TQuotationOption } from "@/types/quotation.type";

type TQuotationTransferSectionProps = {
  option: TQuotationOption;
  currency: string;
  onChange: (patch: Partial<TQuotationOption>) => void;
  onAddRoute: () => void;
  onRemoveRoute: (routeId: string) => void;
  onUpdateRoute: (
    routeId: string,
    patch: Partial<{ from: string; to: string }>,
  ) => void;
};

export function QuotationTransferSection({
  option,
  currency,
  onChange,
  onAddRoute,
  onRemoveRoute,
  onUpdateRoute,
}: TQuotationTransferSectionProps) {
  const displayTransferCost = option.transferSectionEnabled
    ? option.transferCost
    : 0;

  return (
    <Card className="rounded!">
      <QuotationSectionHeader
        icon={<MapPin className="size-5 text-brand-primary" />}
        title="Transfer routes"
        enabled={option.transferSectionEnabled}
        onEnabledChange={(transferSectionEnabled) =>
          onChange({ transferSectionEnabled })
        }
        priceLabel={formatQuotationMoney(displayTransferCost, currency)}
      />
      <CardContent
        className={`space-y-3 ${quotationSectionBodyClass(option.transferSectionEnabled)}`}
      >
        <div className="flex justify-end">
          <Input
            type="number"
            min={0}
            step="0.01"
            value={option.transferCost || ""}
            onChange={(e) =>
              onChange({ transferCost: Number.parseFloat(e.target.value) || 0 })
            }
            placeholder="Transfer cost"
            className="max-w-[160px] rounded!"
            aria-label="Transfer cost"
          />
        </div>
        {option.routes.map((route) => (
          <div
            key={route.id}
            className="grid gap-3 rounded! border border-border p-3 md:grid-cols-[1fr_auto_1fr_auto]"
          >
            <div className="space-y-2">
              <Label>From</Label>
              <Select
                value={route.from}
                onValueChange={(value) => onUpdateRoute(route.id, { from: value })}
              >
                <SelectTrigger className="rounded!">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSFER_LOCATIONS.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="hidden items-end justify-center pb-2 md:flex">
              <Plus className="size-4 rotate-45 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Select
                value={route.to}
                onValueChange={(value) => onUpdateRoute(route.id, { to: value })}
              >
                <SelectTrigger className="rounded!">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSFER_LOCATIONS.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded!"
                disabled={option.routes.length <= 1}
                onClick={() => onRemoveRoute(route.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="w-full rounded! border-dashed"
          onClick={onAddRoute}
        >
          <PlusCircle className="size-4" />
          Add route row
        </Button>
      </CardContent>
    </Card>
  );
}
