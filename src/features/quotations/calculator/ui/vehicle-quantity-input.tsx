"use client";

import { Minus, Plus } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 999;

const quantityStepperButtonClass =
  "my-1 bg-brand-primary text-white hover:bg-brand-primary-700 hover:text-white disabled:bg-brand-primary/40 disabled:text-white/70";

type TVehicleQuantityInputProps = {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
};

function clampQuantity(value: number): number {
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, value));
}

export function VehicleQuantityInput({
  id,
  value,
  onChange,
  disabled = false,
  className,
}: TVehicleQuantityInputProps) {
  const decrement = () => onChange(clampQuantity(value - 1));
  const increment = () => onChange(clampQuantity(value + 1));

  return (
    <InputGroup
      className={cn("h-10 rounded! bg-muted/40", className)}
      data-disabled={disabled ? true : undefined}
    >
      <InputGroupAddon align="inline-start" className="pl-2.5">
        <InputGroupButton
          type="button"
          size="icon-sm"
          aria-label="Decrease quantity"
          disabled={disabled || value <= MIN_QUANTITY}
          onClick={decrement}
          className={quantityStepperButtonClass}
        >
          <Minus className="size-4" />
        </InputGroupButton>
      </InputGroupAddon>

      <InputGroupInput
        id={id}
        type="number"
        inputMode="numeric"
        min={MIN_QUANTITY}
        max={MAX_QUANTITY}
        step={1}
        value={value}
        disabled={disabled}
        aria-label="Vehicle quantity"
        className="text-center text-sm font-medium tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        onChange={(e) => {
          const parsed = Number.parseInt(e.target.value, 10);
          if (Number.isNaN(parsed)) return;
          onChange(clampQuantity(parsed));
        }}
        onBlur={(e) => {
          const parsed = Number.parseInt(e.target.value, 10);
          onChange(clampQuantity(Number.isNaN(parsed) ? MIN_QUANTITY : parsed));
        }}
      />

      <InputGroupAddon align="inline-end" className="gap-1.5 pr-2.5">
        <InputGroupText className="pl-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          unit(s)
        </InputGroupText>
        <InputGroupButton
          type="button"
          size="icon-sm"
          aria-label="Increase quantity"
          disabled={disabled || value >= MAX_QUANTITY}
          onClick={increment}
          className={quantityStepperButtonClass}
        >
          <Plus className="size-4" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
