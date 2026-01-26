import { Request, Response } from "express";
import { previewPricing } from "../services/pricing.service";

export function previewPricingController(req: Request, res: Response) {
  try {
    const result = previewPricing(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: "Invalid pricing request" });
  }
}
