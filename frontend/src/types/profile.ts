export type AdjustmentType = "fixed" | "dynamic"
export type IncrementType = "increase" | "decrease"

export type PriceItem = {
  productId: string;
  adjustmentType: AdjustmentType;
  incrementType: IncrementType;
  adjustmentValue: number;
  adjustment: number;
}

export type PricingProfile = {
  id: string;
  name: string;
  basedOnProfileId: string | null;
  items: PriceItem[];
  createdAt: string;
};