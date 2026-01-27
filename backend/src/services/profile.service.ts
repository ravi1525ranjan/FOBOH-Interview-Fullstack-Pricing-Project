import { profiles } from "../data/profiles";
import { PricingProfile } from "../types/profile";
import { pricingProfiles } from "../data/profile";
import { v4 as uuidv4 } from 'uuid';

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

export const saveProfile = (data: Omit<PricingProfile, 'id' | 'createdAt'>): PricingProfile => {
  const newProfile: PricingProfile = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString()
  };
  pricingProfiles.push(newProfile);
  return newProfile;
};

export const getAllProfiles = (): PricingProfile[] => {
  return pricingProfiles;
};
