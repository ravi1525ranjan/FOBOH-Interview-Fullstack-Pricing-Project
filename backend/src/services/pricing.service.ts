import {products} from "../data/products";
import { calculateNewPrice } from "../utils/pricing";
import { PricingRequestBody, PricingResponseRow } from "../types/pricing";

export function previewPricing(
  payload: PricingRequestBody
): PricingResponseRow[] {
  const { adjustmentType, incrementType, rows } = payload;

  return rows.map(({ productId, adjustment }) => {
    const product = products.find((p) => p.id === productId);
    const basePrice = product?.globalWholesalePrice ?? 0;

    const newPrice = calculateNewPrice({
      basePrice,
      adjustmentValue: adjustment,
      adjustmentType,
      incrementType,
    });

    return {
      productId,
      basePrice,
      newPrice,
    };
  });
}
