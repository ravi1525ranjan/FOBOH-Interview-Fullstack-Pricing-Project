import { z } from "zod";

export const adjustmentTypeSchema = z.enum(["fixed", "dynamic"]);
export const incrementTypeSchema = z.enum(["increase", "decrease"]);

export const createProfileSchema = z.object({
  name: z.string().min(2),
  basedOnProfileId: z.string().nullable(),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      adjustmentType: adjustmentTypeSchema,
      incrementType: incrementTypeSchema,
      adjustmentValue: z.number().nonnegative()
    })
  )
});

export const queryProductsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  segment: z.string().optional(),
  brand: z.string().optional()
});
