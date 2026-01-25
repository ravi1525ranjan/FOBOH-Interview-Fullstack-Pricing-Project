import { PricingProfile } from "../types/profile";

export const profiles: PricingProfile[] = [
  {
    id: "global",
    name: "Global Wholesale Price",
    basedOnProfileId: null,
    items: [],
    createdAt: new Date().toISOString()
  }
];
