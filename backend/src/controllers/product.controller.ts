import { Request, Response } from "express";
import { queryProductsSchema } from "../utils/validation";
import { listProducts } from "../services/product.service";

export function getProducts(req: Request, res: Response) {
  const parseResult = queryProductsSchema.safeParse(req.query);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors });
  }

  const products = listProducts(parseResult.data);
  return res.json(products);
}
