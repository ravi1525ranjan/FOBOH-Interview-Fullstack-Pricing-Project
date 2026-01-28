import { type Product, type PricingProfile } from "../types";

// Look for the environment variable, fallback to localhost for development
const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : "http://localhost:4000/api";

type PricingPreviewPayload = {
  adjustmentType: "fixed" | "dynamic";
  incrementType: "increase" | "decrease";
  rows: { productId: string; adjustment: number }[];
};

export async function fetchProducts(query?: Record<string, string>) {
  const params = new URLSearchParams(query as any);
  const res = await fetch(`${API_BASE}/products?${params.toString()}`);
  return res.json() as Promise<Product[]>;
}

export async function fetchProfiles() {
  const res = await fetch(`${API_BASE}/profiles`);
  return res.json() as Promise<PricingProfile[]>;
}

export async function createProfile(profile: Omit<PricingProfile, "id" | "createdAt">) {
  const res = await fetch(`${API_BASE}/profiles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile)
  });
  return res.json() as Promise<PricingProfile>;
}

export async function previewPricing(payload: PricingPreviewPayload) {
  const res = await fetch(`${API_BASE}/pricing/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json() as Promise<
    { productId: string; basePrice: number; newPrice: number }[]
  >;
}

export const fetchPricingProfiles = async () => {
  const res = await fetch(`${API_BASE}/profiles`);
  return res.json();
};

export const savePricingProfile = async (profileData: any) => {
  const res = await fetch(`${API_BASE}/profiles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });
  return res.json();
};
