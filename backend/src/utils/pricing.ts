// import { AdjustmentType, IncrementType } from "../types/product";

type PricingInput = {
  basePrice: number;
  adjustmentValue: number;
  adjustmentType: any;
  incrementType: any;
};

export function calculateNewPrice({
  basePrice,
  adjustmentValue,
  adjustmentType,
  incrementType,
}: PricingInput): number {
  if (basePrice <= 0 || adjustmentValue <= 0) {
    return roundAndClamp(basePrice);
  }

  const delta =
    adjustmentType === "fixed"
      ? adjustmentValue
      : (adjustmentValue / 100) * basePrice;

  const price =
    incrementType === "increase"
      ? basePrice + delta
      : basePrice - delta;

  return roundAndClamp(price);
}

function roundAndClamp(value: number) {
  return Math.max(0, Number(value.toFixed(2)));
}
