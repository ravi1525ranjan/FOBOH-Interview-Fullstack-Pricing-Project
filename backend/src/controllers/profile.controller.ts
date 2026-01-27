import { Request, Response } from "express";
import { z } from "zod";
import { createProfileSchema } from "../utils/validation";
import { listProfiles, getProfile, saveProfile, deleteProfile, getAllProfiles } from "../services/profile.service";
import { v4 as uuid } from "uuid";

export function listAllProfiles(_req: Request, res: Response) {
  return res.json(listProfiles());
}

export function getSingleProfile(req: Request, res: Response) {
  const id = req.params.id;
  const profile = getProfile(id);
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  return res.json(profile);
}

// export function createNewProfile(req: Request, res: Response) {
//   const parsed = createProfileSchema.safeParse(req.body);
//   if (!parsed.success) {
//     return res.status(400).json({ error: parsed.error.errors });
//   }

//   const profile = {
//     id: uuid(),
//     name: parsed.data.name,
//     basedOnProfileId: parsed.data.basedOnProfileId,
//     items: parsed.data.items,
//     createdAt: new Date().toISOString()
//   };

//   return res.status(201).json(createProfile(profile));
// }

export function removeProfile(req: Request, res: Response) {
  const id = req.params.id;
  const deleted = deleteProfile(id);
  if (!deleted) return res.status(404).json({ error: "Profile not found" });
  return res.status(204).send();
}

export const createProfile = (req: Request, res: Response) => {
  try {
    const profile = saveProfile(req.body);
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to save profile" });
  }
};

export const getProfiles = (req: Request, res: Response) => {
  res.json(getAllProfiles());
};
