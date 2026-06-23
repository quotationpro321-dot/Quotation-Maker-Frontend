"use client";

import { MapPin, Hotel } from "lucide-react";

import { ReusableTabs } from "@/components/ui/reusable-tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SettingsHotelCatalogSection } from "@/features/settings/ui/settings-hotel-catalog-section";
import { SettingsTransferCatalogSection } from "@/features/settings/ui/settings-transfer-catalog-section";
import type { TCalculatorCatalogType } from "@/redux/api/hotels.api";

function CalculatorCatalogTypePanel({
  calculatorType,
}: {
  calculatorType: TCalculatorCatalogType;
}) {
  return (
    <div className="space-y-6">
      <SettingsHotelCatalogSection calculatorType={calculatorType} />
      <SettingsTransferCatalogSection calculatorType={calculatorType} />
    </div>
  );
}

export function SettingsCalculatorCatalogPanel() {
  return (
    <Card className="rounded!">
      <CardHeader>
        <CardTitle>Quotation calculator options</CardTitle>
        <CardDescription>
          Manage hotel areas, hotels, and transfer route locations for Umrah and
          Holiday quotations. Changes apply to new calculator sessions immediately.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReusableTabs
          defaultValue="umrah"
          tabs={[
            {
              value: "umrah",
              label: "Umrah",
              icon: <Hotel className="size-4" aria-hidden />,
              content: <CalculatorCatalogTypePanel calculatorType="umrah" />,
            },
            {
              value: "holiday",
              label: "Holiday",
              icon: <MapPin className="size-4" aria-hidden />,
              content: <CalculatorCatalogTypePanel calculatorType="holiday" />,
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
