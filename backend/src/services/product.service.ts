import { products } from "../data/products";
import { Product } from "../types/product";

export function listProducts(filters: {
  q?: string;
  category?: string;
  subCategory?: string;
  segment?: string;
  brand?: string;
}): Product[] {
  const q = filters.q?.trim().toLowerCase() || "";

  return products.filter((p) => {
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.skuCode.toLowerCase().includes(q) ||
      p.title.toLowerCase().startsWith(q) ||
      p.skuCode.toLowerCase().startsWith(q);

    const matchesCategory = !filters.category || p.categoryId === filters.category;
    const matchesSub = !filters.subCategory || p.subCategoryId === filters.subCategory;
    const matchesSeg = !filters.segment || p.segmentId === filters.segment;
    const matchesBrand = !filters.brand || p.brand === filters.brand;

    return matchesQuery && matchesCategory && matchesSub && matchesSeg && matchesBrand;
  });
}
