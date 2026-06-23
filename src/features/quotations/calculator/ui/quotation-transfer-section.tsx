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
import {
  canAddCustomIncludedService,
  createCustomIncludedService,
  normalizeCustomIncludedServices,
} from "@/features/quotations/calculator/lib/quotation-custom-included-services";
import { formatQuotationMoney } from "@/features/quotations/calculator/lib/calculate-quotation";
import {
  INCLUDED_SERVICE_OPTIONS,
  type TTransferRouteOption,
} from "@/features/quotations/calculator/lib/quotation-transfer.constants";
import {
  QuotationSectionHeader,
  quotationSectionBodyClass,
} from "@/features/quotations/calculator/ui/quotation-section-header";
import { VehicleQuantityInput } from "@/features/quotations/calculator/ui/vehicle-quantity-input";
import type { TCalculatorCatalogType } from "@/redux/api/hotels.api";
import { useListTransferLocationsQuery } from "@/redux/api/transfer.api";
import type {
  TQuotationCalculatorType,
  TQuotationCustomIncludedService,
  TQuotationIncludedServices,
  TQuotationOption,
} from "@/types/quotation.type";
import { cn } from "@/lib/utils";

type TQuotationTransferSectionProps = {
  calculatorType: TQuotationCalculatorType;
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
const includedServiceCellClass =
  "flex h-11 items-center gap-2.5 rounded! border border-border bg-muted/20 px-3";
const includedServiceLabelClass =
  "text-xs font-semibold uppercase tracking-wide text-foreground";
const includedServiceInlineInputClass =
  "min-w-0 flex-1 border-0 bg-transparent p-0 text-xs font-semibold uppercase tracking-wide text-foreground outline-none placeholder:text-muted-foreground/80 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-0";

function toCatalogCalculatorType(
  calculatorType: TQuotationCalculatorType,
): TCalculatorCatalogType {
  return calculatorType === "holiday" ? "holiday" : "umrah";
}

function RouteLocationSelect({
  label,
  value,
  options,
  placeholder,
  disabled,
  onValueChange,
}: {
  label: string;
  value: string;
  options: TTransferRouteOption[];
  placeholder: string;
  disabled: boolean;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={value || undefined}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger className={transferSelectTriggerClass}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function QuotationTransferSection({
  calculatorType,
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
  const catalogCalculatorType = toCatalogCalculatorType(calculatorType);

  const {
    data: locationsResponse,
    isLoading: locationsLoading,
    isError: locationsError,
  } = useListTransferLocationsQuery({ calculatorType: catalogCalculatorType });

  const catalogLocations = locationsResponse?.data ?? [];
  const routeOptions: TTransferRouteOption[] = catalogLocations.map(
    (location) => ({
      value: location.name,
      label: location.name,
    }),
  );

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

  const customIncludedServices = normalizeCustomIncludedServices(
    option.customIncludedServices,
  );

  const addCustomIncludedService = () => {
    if (!canAddCustomIncludedService(customIncludedServices)) return;
    onChange({
      customIncludedServices: [
        ...customIncludedServices,
        createCustomIncludedService(),
      ],
    });
  };

  const updateCustomIncludedService = (
    serviceId: string,
    patch: Partial<TQuotationCustomIncludedService>,
  ) => {
    onChange({
      customIncludedServices: customIncludedServices.map((service) =>
        service.id === serviceId ? { ...service, ...patch } : service,
      ),
    });
  };

  const removeCustomIncludedService = (serviceId: string) => {
    onChange({
      customIncludedServices: customIncludedServices.filter(
        (service) => service.id !== serviceId,
      ),
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
              className={cn(includedServiceCellClass, "cursor-pointer")}
            >
              <Checkbox
                checked={option.includedServices[service.id]}
                onCheckedChange={() => toggleIncludedService(service.id)}
                disabled={sectionDisabled}
              />
              <span className={cn(includedServiceLabelClass, "truncate")}>
                {service.label}
              </span>
            </label>
          ))}

          {customIncludedServices.map((service) => (
            <div key={service.id} className={includedServiceCellClass}>
              <Checkbox
                checked={service.included}
                onCheckedChange={(checked) =>
                  updateCustomIncludedService(service.id, {
                    included: checked === true,
                  })
                }
                disabled={sectionDisabled}
                aria-label={`Include ${service.label || "custom service"}`}
              />
              <input
                type="text"
                value={service.label}
                onChange={(event) =>
                  updateCustomIncludedService(service.id, {
                    label: event.target.value,
                  })
                }
                placeholder="Custom service"
                disabled={sectionDisabled}
                className={includedServiceInlineInputClass}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="size-6 shrink-0 rounded! p-0"
                disabled={sectionDisabled}
                onClick={() => removeCustomIncludedService(service.id)}
                aria-label="Remove custom service"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}

          <button
            type="button"
            className={cn(
              includedServiceCellClass,
              "cursor-pointer justify-center border-dashed text-muted-foreground transition-colors hover:border-brand-primary hover:bg-brand-primary/5 hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-50",
            )}
            disabled={
              sectionDisabled ||
              !canAddCustomIncludedService(customIncludedServices)
            }
            onClick={addCustomIncludedService}
          >
            <PlusCircle className="size-4 shrink-0" />
            <span className={cn(includedServiceLabelClass, "truncate")}>
              Add checkbox
            </span>
          </button>
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
              <RouteLocationSelect
                label="From"
                value={route.from}
                options={routeOptions}
                placeholder={
                  locationsLoading ? "Loading locations…" : "Select location"
                }
                disabled={sectionDisabled || locationsLoading}
                onValueChange={(value) =>
                  onUpdateRoute(route.id, { from: value })
                }
              />
              <div className="hidden items-end justify-center pb-2 md:flex">
                <div className="flex size-8 items-center justify-center rounded-full bg-brand-primary text-white">
                  <Plus className="size-4 rotate-45" />
                </div>
              </div>
              <RouteLocationSelect
                label="To"
                value={route.to}
                options={routeOptions}
                placeholder={
                  locationsLoading ? "Loading locations…" : "Select location"
                }
                disabled={sectionDisabled || locationsLoading}
                onValueChange={(value) => onUpdateRoute(route.id, { to: value })}
              />
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
