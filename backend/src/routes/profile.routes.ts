import { Router } from "express";
import { listAllProfiles, getSingleProfile, removeProfile, getProfiles, createProfile } from "../controllers/profile.controller";

const router = Router();

// router.get("/", listAllProfiles);
router.get("/:id", getSingleProfile);
router.delete("/:id", removeProfile);
router.post("/", createProfile);
router.get("/", getProfiles);

export default router;
