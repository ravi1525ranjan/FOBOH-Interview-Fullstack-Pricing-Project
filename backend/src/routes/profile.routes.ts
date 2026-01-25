import { Router } from "express";
import { listAllProfiles, getSingleProfile, createNewProfile, removeProfile } from "../controllers/profile.controller";

const router = Router();

router.get("/", listAllProfiles);
router.post("/", createNewProfile);
router.get("/:id", getSingleProfile);
router.delete("/:id", removeProfile);

export default router;
