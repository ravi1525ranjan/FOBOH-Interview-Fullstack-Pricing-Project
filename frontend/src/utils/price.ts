import type { AdjustmentType, IncrementType } from "../types";

export function calcNewPrice(basePrice: number, adjustmentType: AdjustmentType, incrementType: IncrementType, value: number) {
  if (adjustmentType === "fixed") {
    return incrementType === "increase" ? basePrice + value : basePrice - value;
  }
  const delta = (basePrice * value) / 100;
  return incrementType === "increase" ? basePrice + delta : basePrice - delta;
}
