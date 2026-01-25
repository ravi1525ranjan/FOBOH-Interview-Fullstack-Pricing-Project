import { useEffect, useMemo, useState } from "react";
import type {
  Product,
  PricingProfile,
  AdjustmentType,
  IncrementType,
} from "../types";
import { fetchProducts, fetchProfiles, createProfile } from "../api/api";
import { calcNewPrice } from "../utils/price";
import ProductTable from "../components/ProductTable";

type SelectionMode = "one" | "many" | "all";

type Row = {
  product: Product;
  basedOnPrice: number;
  newPrice: number;
};

type Props = {
  rows: Row[];
};

export default function PricePreview({ rows }: Props) {
 const [products, setProducts] = useState<Product[]>([]);
  const [profiles, setProfiles] = useState<PricingProfile[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [mode, setMode] = useState<SelectionMode>("many");
//   const [search, setSearch] = useState("");
//   const [filters, setFilters] = useState({
//     category: "",
//     subCategory: "",
//     segment: "",
//     brand: "",
//   });

  const [basedOnProfileId, setBasedOnProfileId] = useState<string | null>(
    "global",
  );
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>("fixed");
  const [incrementType, setIncrementType] = useState<IncrementType>("decrease");
//   const [adjustmentValue, setAdjustmentValue] = useState<number>(0);

//   const [profileName, setProfileName] = useState("New Pricing Profile");
//   const [previewRows, setPreviewRows] = useState<
//     { product: Product; basedOnPrice: number; newPrice: number }[]
//   >([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchProfiles().then(setProfiles);
  }, []);

//   const filteredProducts = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     return products.filter((p) => {
//       const matchesQ =
//         !q ||
//         p.title.toLowerCase().includes(q) ||
//         p.sku.toLowerCase().includes(q);

//       const matchesCategory =
//         !filters.category || p.category === filters.category;
//       const matchesSub =
//         !filters.subCategory || p.subCategory === filters.subCategory;
//       const matchesSeg = !filters.segment || p.segment === filters.segment;
//       const matchesBrand = !filters.brand || p.brand === filters.brand;

//       return (
//         matchesQ && matchesCategory && matchesSub && matchesSeg && matchesBrand
//       );
//     });
//   }, [products, search, filters]);

//   const selectableProducts = mode === "all" ? products : filteredProducts;

//   const toggle = (id: string) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
//     );
//   };

//   const toggleAll = () => {
//     const allIds = selectableProducts.map((p) => p.id);
//     const allSelected = allIds.every((id) => selected.includes(id));
//     setSelected(allSelected ? [] : allIds);
//   };

  useEffect(() => {
    if (mode === "all") {
      setSelected(products.map((p) => p.id));
    } else {
      setSelected([]);
    }
  }, [mode, products]);

//   const basedOnPrice = useMemo(() => {
//     // currently only global base price exists
//     return (product: Product) => product.basePrice;
//   }, []);

//   const calculatePreview = () => {
//     const rows = selectableProducts
//       .filter((p) => selected.includes(p.id))
//       .map((product) => {
//         const base = basedOnPrice(product);
//         const newPrice = calcNewPrice(
//           base,
//           adjustmentType,
//           incrementType,
//           adjustmentValue,
//         );
//         return { product, basedOnPrice: base, newPrice };
//       });

//     setPreviewRows(rows);
//   };

//   const applyProfile = async () => {
//     const items = previewRows.map((r) => ({
//       productId: r.product.id,
//       adjustmentType,
//       incrementType,
//       adjustmentValue,
//     }));

//     const payload = {
//       name: profileName,
//       basedOnProfileId,
//       items,
//     };

//     const created = await createProfile(payload);
//     setProfiles((prev) => [...prev, created]);
//     alert("Pricing profile created successfully!");
//   };

  return (
    <div className="card">
      <h2>Preview</h2>
        <div className="row">
          <label>Based On</label>
          <select
            value={basedOnProfileId ?? ""}
            onChange={(e) => setBasedOnProfileId(e.target.value || null)}
          >
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
                <div className="row">
          <label>Adjustment Type</label>
          <div className="radioRow">
            <label>
              <input
                type="radio"
                checked={adjustmentType === "fixed"}
                onChange={() => setAdjustmentType("fixed")}
              />
              Fixed ($)
            </label>
            <label>
              <input
                type="radio"
                checked={adjustmentType === "dynamic"}
                onChange={() => setAdjustmentType("dynamic")}
              />
              Dynamic (%)
            </label>
          </div>
        </div>

        <div className="row">
          <label>Increment</label>
          <div className="radioRow">
            <label>
              <input
                type="radio"
                checked={incrementType === "increase"}
                onChange={() => setIncrementType("increase")}
              />
              Increase
            </label>
            <label>
              <input
                type="radio"
                checked={incrementType === "decrease"}
                onChange={() => setIncrementType("decrease")}
              />
              Decrease
            </label>
          </div>
        </div>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Based On</th>
            <th>New Price</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.product?.id}>
              <td>{r.product?.title}</td>
              <td>${r.basedOnPrice?.toFixed(2)}</td>
              <td>${r.newPrice?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
