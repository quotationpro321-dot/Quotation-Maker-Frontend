"use client";

import { Calendar as CalendarIcon, Hotel, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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
import {
  calculateHotelTotal,
  formatQuotationMoney,
} from "@/features/quotations/calculator/lib/calculate-quotation";
import {
  createEmptyHotel,
  HOTEL_BOARD_OPTIONS,
} from "@/features/quotations/calculator/lib/quotation-calculator-defaults";
import {
  MAX_HOTEL_STAYS,
  MIN_HOTEL_STAYS,
  getHotelStayHeading,
  getCustomHotelValue,
  getCustomLocationValue,
  getUsedAreaSlugs,
  getUsedCustomLocations,
  isCatalogArea,
  isCatalogHotel,
  resolveHotelAreaSlug,
  showsHotelDistance,
} from "@/features/quotations/calculator/lib/quotation-hotel-slots";
import { HotelStayDateRangeDialog } from "@/features/quotations/calculator/ui/hotel-date-range-picker";
import {
  QuotationSectionHeader,
  quotationSectionBodyClass,
} from "@/features/quotations/calculator/ui/quotation-section-header";
import {
  useListHotelAreasQuery,
  useListHotelsByAreaQuery,
  type THotelAreaDto,
  type THotelDto,
} from "@/redux/api/hotels.api";
import type { TQuotationHotel, TQuotationOption } from "@/types/quotation.type";

type TQuotationHotelSectionProps = {
  option: TQuotationOption;
  currency: string;
  onChange: (patch: Partial<TQuotationOption>) => void;
};

const hotelInputClass = "h-10 w-full rounded! text-sm";
const hotelSelectTriggerClass = "h-10! w-full rounded! text-sm";

type THotelAccommodationRowProps = {
  slotIndex: number;
  hotel: TQuotationHotel;
  areas: THotelAreaDto[];
  areasLoading: boolean;
  disabledAreaSlugs: Set<string>;
  usedCustomLocations: Set<string>;
  disabled: boolean;
  canRemove: boolean;
  onHotelChange: (hotel: TQuotationHotel) => void;
  onRemove: () => void;
};

function HotelAccommodationRow({
  slotIndex,
  hotel,
  areas,
  areasLoading,
  disabledAreaSlugs,
  usedCustomLocations,
  disabled,
  canRemove,
  onHotelChange,
  onRemove,
}: THotelAccommodationRowProps) {
  const [stayDatesOpen, setStayDatesOpen] = useState(false);

  const openStayDates = () => {
    if (!disabled) setStayDatesOpen(true);
  };

  const areaSlug = useMemo(
    () => resolveHotelAreaSlug(hotel, areas),
    [areas, hotel],
  );

  const {
    data: hotelsResponse,
    isLoading: hotelsLoading,
    isError: hotelsError,
  } = useListHotelsByAreaQuery({ area: areaSlug ?? "" }, { skip: !areaSlug });

  const hotels = hotelsResponse?.data ?? [];

  useEffect(() => {
    if (hotelsError) {
      toast.error("Could not load hotels for the selected area.");
    }
  }, [hotelsError]);

  const handleAreaChange = (areaId: string) => {
    const area = areas.find((item) => item.id === areaId);
    if (!area) return;

    onHotelChange({
      ...hotel,
      location: area.name,
      areaSlug: area.slug,
      name: "",
      city: "",
      country: "",
      distance: "",
    });
  };

  const handleCustomLocationChange = (value: string) => {
    onHotelChange({
      ...hotel,
      location: value,
      areaSlug: undefined,
      name: "",
      city: "",
      country: "",
      distance: "",
    });
  };

  const handleHotelSelect = (hotelName: string) => {
    const selected = hotels.find((item) => item.name === hotelName);
    onHotelChange({
      ...hotel,
      name: hotelName,
      city: selected?.city ?? "",
      country: selected?.country ?? "",
      distance: selected?.distance ?? "",
      location: selected?.areaName ?? hotel.location,
      areaSlug: selected?.areaSlug ?? hotel.areaSlug,
    });
  };

  const handleCustomHotelChange = (value: string) => {
    onHotelChange({
      ...hotel,
      name: value,
      city: "",
      country: "",
      distance: "",
    });
  };

  const catalogAreaSelected = isCatalogArea(hotel, areas);
  const selectedAreaId = catalogAreaSelected
    ? (areas.find((area) => area.slug === hotel.areaSlug)?.id ?? "")
    : "";
  const customLocationValue = getCustomLocationValue(hotel, areas);
  const customHotelValue = getCustomHotelValue(hotel, hotels);
  const catalogHotelSelected = isCatalogHotel(hotel, hotels);
  const customLocationKey = customLocationValue.trim().toLowerCase();
  const isDuplicateCustomLocation =
    customLocationKey.length > 0 && usedCustomLocations.has(customLocationKey);
  const hasLocation = Boolean(hotel.location.trim());

  const distanceLabel = showsHotelDistance(areaSlug)
    ? hotel.distance || "Select hotel"
    : "N/A";

  return (
    <div
      className="space-y-4 rounded! border border-border p-4"
      aria-label={getHotelStayHeading(slotIndex)}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">
          {getHotelStayHeading(slotIndex)}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded!"
          disabled={disabled || !canRemove}
          onClick={onRemove}
          aria-label={`Remove ${getHotelStayHeading(slotIndex)}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Location / area</Label>
          <Select
            value={selectedAreaId || undefined}
            onValueChange={handleAreaChange}
            disabled={disabled || areasLoading}
          >
            <SelectTrigger className={hotelSelectTriggerClass}>
              <SelectValue
                placeholder={areasLoading ? "Loading areas…" : "Select area"}
              />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => {
                const isTakenElsewhere =
                  disabledAreaSlugs.has(area.slug) &&
                  area.id !== selectedAreaId;

                return (
                  <SelectItem
                    key={area.id}
                    value={area.id}
                    disabled={isTakenElsewhere}
                  >
                    {area.name}
                    {isTakenElsewhere ? " (already selected)" : ""}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Input
            value={customLocationValue}
            onChange={(e) => handleCustomLocationChange(e.target.value)}
            placeholder="Or enter custom location"
            disabled={disabled}
            aria-invalid={isDuplicateCustomLocation}
            className={hotelInputClass}
          />
          {isDuplicateCustomLocation ? (
            <p className="text-xs text-destructive">
              This location is already used in another stay.
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label>Hotel</Label>
          <Select
            value={catalogHotelSelected ? hotel.name : undefined}
            onValueChange={handleHotelSelect}
            disabled={disabled || hotelsLoading || !areaSlug}
          >
            <SelectTrigger className={hotelSelectTriggerClass}>
              <SelectValue
                placeholder={
                  !areaSlug
                    ? "Select area first"
                    : hotelsLoading
                      ? "Loading hotels…"
                      : "Select hotel"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {hotels.map((item: THotelDto) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={customHotelValue}
            onChange={(e) => handleCustomHotelChange(e.target.value)}
            placeholder="Or enter custom hotel"
            disabled={disabled || !hasLocation}
            className={hotelInputClass}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label>Distance</Label>
          <div
            className={`flex items-center border border-input bg-muted/30 px-3 text-sm text-muted-foreground ${hotelInputClass}`}
          >
            {distanceLabel}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Check-in</Label>
          <div className="relative">
            <Input
              readOnly
              value={hotel.checkIn}
              placeholder="Select dates"
              disabled={disabled}
              onClick={openStayDates}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openStayDates();
                }
              }}
              className={`cursor-pointer pr-9 ${hotelInputClass}`}
              aria-haspopup="dialog"
              aria-expanded={stayDatesOpen}
            />
            <CalendarIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Check-out</Label>
          <div className="relative">
            <Input
              readOnly
              value={hotel.checkOut}
              placeholder="Select dates"
              disabled={disabled}
              onClick={openStayDates}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openStayDates();
                }
              }}
              className={`cursor-pointer pr-9 ${hotelInputClass}`}
              aria-haspopup="dialog"
              aria-expanded={stayDatesOpen}
            />
            <CalendarIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Board</Label>
          <Select
            value={hotel.board || undefined}
            onValueChange={(board) => onHotelChange({ ...hotel, board })}
            disabled={disabled}
          >
            <SelectTrigger className={hotelSelectTriggerClass}>
              <SelectValue placeholder="Select board type" />
            </SelectTrigger>
            <SelectContent>
              {HOTEL_BOARD_OPTIONS.map((board) => (
                <SelectItem key={board} value={board}>
                  {board}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <HotelStayDateRangeDialog
        open={stayDatesOpen}
        onOpenChange={setStayDatesOpen}
        checkIn={hotel.checkIn}
        checkOut={hotel.checkOut}
        onApply={(checkIn, checkOut) =>
          onHotelChange({ ...hotel, checkIn, checkOut })
        }
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Room category</Label>
          <Input
            value={hotel.roomType}
            onChange={(e) =>
              onHotelChange({ ...hotel, roomType: e.target.value })
            }
            placeholder="e.g. Double"
            disabled={disabled}
            className={hotelInputClass}
          />
        </div>
        <div className="space-y-2">
          <Label>Cost</Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={hotel.cost || ""}
            onChange={(e) =>
              onHotelChange({
                ...hotel,
                cost: Number.parseFloat(e.target.value) || 0,
              })
            }
            disabled={disabled}
            className={hotelInputClass}
          />
        </div>
      </div>
    </div>
  );
}

export function QuotationHotelSection({
  option,
  currency,
  onChange,
}: TQuotationHotelSectionProps) {
  const hotelTotal = calculateHotelTotal(option);
  const displayHotelTotal = option.hotelSectionEnabled ? hotelTotal : 0;
  const sectionDisabled = !option.hotelSectionEnabled;
  const canAddHotel = option.hotels.length < MAX_HOTEL_STAYS;
  const canRemoveHotel = option.hotels.length > MIN_HOTEL_STAYS;

  const {
    data: areasResponse,
    isLoading: areasLoading,
    isError: areasError,
  } = useListHotelAreasQuery();

  const areas = areasResponse?.data ?? [];

  useEffect(() => {
    if (areasError) {
      toast.error("Could not load hotel areas.");
    }
  }, [areasError]);

  const handleHotelChange = (index: number, hotel: TQuotationHotel) => {
    const hotels = [...option.hotels];
    hotels[index] = hotel;
    onChange({ hotels });
  };

  const handleAddHotel = () => {
    if (!canAddHotel) return;
    onChange({ hotels: [...option.hotels, createEmptyHotel()] });
  };

  const handleRemoveHotel = (index: number) => {
    if (!canRemoveHotel) return;
    onChange({ hotels: option.hotels.filter((_, hotelIndex) => hotelIndex !== index) });
  };

  return (
    <Card className="rounded!">
      <QuotationSectionHeader
        icon={<Hotel className="size-5 text-brand-primary" />}
        title="Hotel accommodation"
        enabled={option.hotelSectionEnabled}
        onEnabledChange={(hotelSectionEnabled) =>
          onChange({ hotelSectionEnabled })
        }
        priceLabel={formatQuotationMoney(displayHotelTotal, currency)}
      />
      <CardContent
        className={`space-y-6 ${quotationSectionBodyClass(option.hotelSectionEnabled)}`}
      >
        {option.hotels.map((hotel, slotIndex) => (
          <HotelAccommodationRow
            key={`hotel-stay-${slotIndex}`}
            slotIndex={slotIndex}
            hotel={hotel}
            areas={areas}
            areasLoading={areasLoading}
            disabledAreaSlugs={getUsedAreaSlugs(option, areas, slotIndex)}
            usedCustomLocations={getUsedCustomLocations(option, areas, slotIndex)}
            disabled={sectionDisabled}
            canRemove={canRemoveHotel}
            onHotelChange={(nextHotel) => handleHotelChange(slotIndex, nextHotel)}
            onRemove={() => handleRemoveHotel(slotIndex)}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full rounded! border-dashed"
          disabled={sectionDisabled || !canAddHotel}
          onClick={handleAddHotel}
        >
          <PlusCircle className="size-4" />
          Add accommodation
        </Button>
      </CardContent>
    </Card>
  );
}
