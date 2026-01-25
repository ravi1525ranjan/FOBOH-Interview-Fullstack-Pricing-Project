import { AdjustmentType, IncrementType } from "../types/profile";

export function calculateNewPrice({
  basePrice,
  adjustmentType,
  incrementType,
  adjustmentValue
}: {
  basePrice: number;
  adjustmentType: AdjustmentType;
  incrementType: IncrementType;
  adjustmentValue: number;
}) {
  if (adjustmentType === "fixed") {
    return incrementType === "increase"
      ? basePrice + adjustmentValue
      : basePrice - adjustmentValue;
  }

  const delta = (basePrice * adjustmentValue) / 100;
  return incrementType === "increase"
    ? basePrice + delta
    : basePrice - delta;
}

// ensures price never becomes negative
export function clampPrice(price: number) {
  return Math.max(0, Math.round(price * 100) / 100);
}
