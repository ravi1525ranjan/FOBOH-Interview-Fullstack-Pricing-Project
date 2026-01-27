import { Product } from "./product";

export type AdjustmentType = "fixed" | "dynamic";
export type IncrementType = "increase" | "decrease";

export type PriceItem = {
  productId: string;
  adjustmentType: AdjustmentType;
  incrementType: IncrementType;
  adjustmentValue: number;
};

export type PricingProfile = {
  id: string;
  name: string;
  basedOnProfileId: string | null; // null means global wholesale
  items: PriceItem[];
  createdAt: string;
};

// export interface ProfileProductAdjustment {
//   productId: string;
//   adjustment: number;
// }

