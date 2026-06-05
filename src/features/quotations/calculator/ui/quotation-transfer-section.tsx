"use client";

import { MapPin, Plus, PlusCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { INCLUDED_SERVICE_OPTIONS } from "@/features/quotations/calculator/lib/quotation-transfer.constants";
import {
  QuotationSectionHeader,
  quotationSectionBodyClass,
} from "@/features/quotations/calculator/ui/quotation-section-header";
import { VehicleQuantityInput } from "@/features/quotations/calculator/ui/vehicle-quantity-input";
import { useListTransferLocationsQuery } from "@/redux/api/transfer.api";
import type { TQuotationIncludedServices, TQuotationOption } from "@/types/quotation.type";

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

const transferInputClass = "h-10 w-full rounded! text-sm";
const transferSelectTriggerClass = "h-10! w-full rounded! text-sm";

export function QuotationTransferSection({
  option,
  currency,
  onChange,
  onAddRoute,
  onRemoveRoute,
  onUpdateRoute,
}: TQuotationTransferSectionProps) {
  const sectionDisabled = !option.transferSectionEnabled;
  const displayTransferCost = option.transferSectionEnabled
    ? option.transferCost
    : 0;

  const {
    data: locationsResponse,
    isLoading: locationsLoading,
    isError: locationsError,
  } = useListTransferLocationsQuery();

  const locations = locationsResponse?.data ?? [];

  useEffect(() => {
    if (locationsError) {
      toast.error("Could not load transfer locations.");
    }
  }, [locationsError]);

  const toggleIncludedService = (key: keyof TQuotationIncludedServices) => {
    onChange({
      includedServices: {
        ...option.includedServices,
        [key]: !option.includedServices[key],
      },
    });
  };

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
        className={`space-y-6 ${quotationSectionBodyClass(option.transferSectionEnabled)}`}
      >
        <div className="flex justify-end">
          <div className="relative w-full max-w-[180px]">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
              {currency === "GBP" ? "£" : currency}
            </span>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={option.transferCost || ""}
              onChange={(e) =>
                onChange({
                  transferCost: Number.parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Transfer cost"
              disabled={sectionDisabled}
              className={`${transferInputClass} pl-8`}
              aria-label="Transfer cost"
            />
          </div>
        </div>

        <div className="grid gap-3 border-b border-border pb-6 sm:grid-cols-2 lg:grid-cols-4">
          {INCLUDED_SERVICE_OPTIONS.map((service) => (
            <label
              key={service.id}
              className="flex cursor-pointer items-center gap-3 rounded! border border-border bg-muted/20 px-3 py-2.5"
            >
              <Checkbox
                checked={option.includedServices[service.id]}
                onCheckedChange={() => toggleIncludedService(service.id)}
                disabled={sectionDisabled}
              />
              <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
                {service.label}
              </span>
            </label>
          ))}
        </div>

        <div className="grid gap-3 border-b border-border pb-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Vehicle name</Label>
            <Input
              value={option.vehicleName}
              onChange={(e) => onChange({ vehicleName: e.target.value })}
              placeholder="e.g. GMC Yukon / Hyundai H1"
              disabled={sectionDisabled}
              className={transferInputClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle-quantity">Quantity</Label>
            <VehicleQuantityInput
              id="vehicle-quantity"
              value={option.vehicleQuantity}
              onChange={(vehicleQuantity) => onChange({ vehicleQuantity })}
              disabled={sectionDisabled}
            />
          </div>
        </div>

        <div className="space-y-3">
          {option.routes.map((route) => (
            <div
              key={route.id}
              className="grid gap-3 rounded! border border-border bg-muted/20 p-3 md:grid-cols-[1fr_auto_1fr_auto]"
            >
              <div className="space-y-2">
                <Label>From</Label>
                <Select
                  value={route.from || undefined}
                  onValueChange={(value) => onUpdateRoute(route.id, { from: value })}
                  disabled={sectionDisabled || locationsLoading}
                >
                  <SelectTrigger className={transferSelectTriggerClass}>
                    <SelectValue
                      placeholder={
                        locationsLoading ? "Loading locations…" : "Select location"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="hidden items-end justify-center pb-2 md:flex">
                <div className="flex size-8 items-center justify-center rounded-full bg-brand-primary text-white">
                  <Plus className="size-4 rotate-45" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>To</Label>
                <Select
                  value={route.to || undefined}
                  onValueChange={(value) => onUpdateRoute(route.id, { to: value })}
                  disabled={sectionDisabled || locationsLoading}
                >
                  <SelectTrigger className={transferSelectTriggerClass}>
                    <SelectValue
                      placeholder={
                        locationsLoading ? "Loading locations…" : "Select location"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.name}>
                        {location.name}
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
                  disabled={sectionDisabled || option.routes.length <= 1}
                  onClick={() => onRemoveRoute(route.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full rounded! border-dashed"
          disabled={sectionDisabled}
          onClick={onAddRoute}
        >
          <PlusCircle className="size-4" />
          Add route row
        </Button>
      </CardContent>
    </Card>
  );
}
