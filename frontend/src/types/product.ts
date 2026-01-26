export type Product = {
  id: string;
  title: string;
  skuCode: string;
  brand: string;
  categoryId: string;
  subCategory: string;
  segmentId: string;
  globalWholesalePrice: number;
  imageUrl?:string;
};