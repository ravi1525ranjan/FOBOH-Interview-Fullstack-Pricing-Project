import { Router } from "express";
import { previewPricingController } from "../controllers/pricing.controller";

const router = Router();

router.post("/preview", previewPricingController);

export default router;
