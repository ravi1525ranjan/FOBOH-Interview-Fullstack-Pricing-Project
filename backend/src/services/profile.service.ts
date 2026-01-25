import { profiles } from "../data/profiles";
import { PricingProfile } from "../types/profile";

export function listProfiles(): PricingProfile[] {
  return profiles;
}

export function getProfile(id: string): PricingProfile | undefined {
  return profiles.find((p) => p.id === id);
}

export function createProfile(profile: PricingProfile): PricingProfile {
  profiles.push(profile);
  return profile;
}

export function deleteProfile(id: string): boolean {
  const idx = profiles.findIndex((p) => p.id === id);
  if (idx < 0) return false;
  profiles.splice(idx, 1);
  return true;
}
