import { useEffect, useMemo, useState } from "react";
import type { Product, PricingProfile } from "../types";
import { fetchProducts, fetchProfiles } from "../api/api";
import ProductTable from "../components/ProductTable";
import PricePreview from "../components/PricePreview";

type SelectionMode = "one" | "many" | "all";

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [profiles, setProfiles] = useState<PricingProfile[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [mode, setMode] = useState<SelectionMode>("many");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    subCategory: "",
    segment: "",
    brand: "",
  });

  //   const [basedOnProfileId, setBasedOnProfileId] = useState<string | null>(
  //     "global",
  //   );
  //   const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>("fixed");
  //   const [incrementType, setIncrementType] = useState<IncrementType>("decrease");
  //   const [adjustmentValue, setAdjustmentValue] = useState<number>(0);

  const [profileName, setProfileName] = useState("New Pricing Profile");
  const [previewRows, setPreviewRows] = useState<
    { product: Product; basedOnPrice: number; newPrice: number }[]
  >([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchProfiles().then(setProfiles);
  }, []);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);

      const matchesCategory =
        !filters.category || p.category === filters.category;
      const matchesSub =
        !filters.subCategory || p.subCategory === filters.subCategory;
      const matchesSeg = !filters.segment || p.segment === filters.segment;
      const matchesBrand = !filters.brand || p.brand === filters.brand;

      return (
        matchesQ && matchesCategory && matchesSub && matchesSeg && matchesBrand
      );
    });
  }, [products, search, filters]);

  const selectableProducts = mode === "all" ? products : filteredProducts;

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    const allIds = selectableProducts.map((p) => p.id);
    const allSelected = allIds.every((id) => selected.includes(id));
    setSelected(allSelected ? [] : allIds);
  };

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
    <div className="grid">
      <div className="card">
        <h2>Pricing Profile</h2>

        <div className="row">
          <label>Profile Name</label>
          <input
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
          />
        </div>

        <div className="row">
          <label>Selection Type</label>
          <div className="radioRow">
            <label>
              <input
                type="radio"
                checked={mode === "one"}
                onChange={() => setMode("one")}
              />
              One Product
            </label>
            <label>
              <input
                type="radio"
                checked={mode === "many"}
                onChange={() => setMode("many")}
              />
              Multiple Products
            </label>
            <label>
              <input
                type="radio"
                checked={mode === "all"}
                onChange={() => setMode("all")}
              />
              All Products
            </label>
          </div>
          <div>
            <h2>Search & Filter</h2>

            <div className="filter-row">
              {/* Search */}
              <div className="row">
                <label>Search</label>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Title or SKU"
                />
              </div>

              {/* Category */}
              <div className="row">
                <label>Category</label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((v) => ({ ...v, category: e.target.value }))
                  }
                >
                  <option value="">All</option>
                  <option value="Wine">Wine</option>
                  <option value="Beer">Beer</option>
                  <option value="Spirits">Spirits</option>
                </select>
              </div>

              {/* Segment */}
              <div className="row">
                <label>Segment</label>
                <select
                  value={filters.segment}
                  onChange={(e) =>
                    setFilters((v) => ({ ...v, segment: e.target.value }))
                  }
                >
                  <option value="">All</option>
                  <option value="Premium">Premium</option>
                  <option value="Standard">Standard</option>
                  <option value="Economy">Economy</option>
                </select>
              </div>

              {/* Brand */}
              <div className="row">
                <label>Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) =>
                    setFilters((v) => ({ ...v, brand: e.target.value }))
                  }
                >
                  <option value="">All</option>
                  <option value="Brand A">Brand A</option>
                  <option value="Brand B">Brand B</option>
                  <option value="Brand C">Brand C</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div>
          <ProductTable
            products={selectableProducts}
            selected={selected}
            onToggle={toggle}
            onToggleAll={toggleAll}
          />
        </div>

        {/* <div className="row">
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
        </div> */}

        {/* <div className="row">
          <label>Value</label>
          <input
            type="number"
            value={adjustmentValue}
            onChange={(e) => setAdjustmentValue(Number(e.target.value))}
            min={0}
            step={adjustmentType === "dynamic" ? 0.1 : 0.01}
          />
        </div>
        <div className="row">
          <button className="btn primary" onClick={calculatePreview}>
            Recalculate Prices
          </button>
          <button className="btn" onClick={applyProfile}>
            Apply Pricing
          </button>
        </div> */}
        <div style={{marginTop: 20}}>
          <PricePreview rows={previewRows} />
        </div>
      </div>
    </div>
  );
}
