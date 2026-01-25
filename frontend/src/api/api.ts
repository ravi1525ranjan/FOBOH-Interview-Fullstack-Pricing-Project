import { type Product, type PricingProfile } from "../types";

const API_BASE = "http://localhost:4000/api";

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
