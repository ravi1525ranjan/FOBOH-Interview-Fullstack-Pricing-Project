export type PricingRequestRow = {
  productId: string;
  adjustment: number;
};

export type PricingRequestBody = {
  adjustmentType: "fixed" | "dynamic";
  incrementType: "increase" | "decrease";
  rows: PricingRequestRow[];
};

export type PricingResponseRow = {
  productId: string;
  basePrice: number;
  newPrice: number;
};
