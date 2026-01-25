import { useEffect, useMemo, useState } from "react";
import type { Product} from "../types";
import { fetchProducts} from "../api/api";
import ProductTable from "../components/ProductTable";
import PricePreview from "../components/PricePreview";

type SelectionMode = "one" | "many" | "all";

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  // const [profiles, setProfiles] = useState<PricingProfile[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [mode, setMode] = useState<SelectionMode>("many");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    segment: "",
    brand: "",
  });

  const [profileName, setProfileName] = useState("New Pricing Profile");
  // const [previewRows, setPreviewRows] = useState<
  //   { product: Product; basedOnPrice: number; newPrice: number }[]
  // >([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
    // fetchProfiles().then(setProfiles);
  }, []);

  const filterOptions = useMemo(() => {
    const categories = new Set<string>();
    const segments = new Set<string>();
    const brands = new Set<string>();

    products.forEach((p) => {
      if (p.categoryId) categories.add(p.categoryId);
      if (p.segmentId) segments.add(p.segmentId);
      if (p.brand) brands.add(p.brand);
    });

    return {
      categories: Array.from(categories),
      segments: Array.from(segments),
      brands: Array.from(brands),
    };
  }, [products]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [search]);

  const filteredProducts = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();

    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.skuCode.toLowerCase().includes(q);

      const matchesCategory =
        !filters.category || p.categoryId === filters.category;

      const matchesSegment =
        !filters.segment || p.segmentId === filters.segment;

      const matchesBrand = !filters.brand || p.brand === filters.brand;

      return matchesSearch && matchesCategory && matchesSegment && matchesBrand;
    });
  }, [products, debouncedSearch, filters]);

  const isSearching = search !== debouncedSearch;
  const selectableProducts = mode === "all" ? products : filteredProducts;

  const clearFilters = () => {
    setSearch("");
    setFilters({
      category: "",
      segment: "",
      brand: "",
    });
  };

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

  const selectedProducts = useMemo(() => {
  return products.filter(p => selected.includes(p.id));
}, [products, selected]);


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
            <div className="product-search">
              <h2>Search for Products</h2>
              <button className="btn-secondary" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
            <div className="filter-row">
              {/* Search */}
              <div className="row">
                <label>Search</label>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Title or SKU"
                />
                {isSearching && (
                  <small className="searching-text">Searching…</small>
                )}
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
                  {filterOptions.categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
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
                  {filterOptions.segments.map((seg) => (
                    <option key={seg} value={seg}>
                      {seg}
                    </option>
                  ))}
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
                  {filterOptions.brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
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
        <div style={{ marginTop: 20 }}>
          <PricePreview products={selectedProducts} />
        </div>
      </div>
    </div>
  );
}
