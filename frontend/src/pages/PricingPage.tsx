import { useEffect, useMemo, useState } from "react";
import type { Product } from "../types";
import { fetchProducts } from "../api/api";
import ProductTable from "../components/ProductTable";
import PricePreview from "../components/PricePreview";

type SelectionMode = "one" | "many" | "all";

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [mode, setMode] = useState<SelectionMode>("many");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    segment: "",
    brand: "",
  });

  const [profileName, setProfileName] = useState(
    "Cheeky little description goes in here",
  );

  useEffect(() => {
    fetchProducts().then(setProducts);
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
    }, 300);

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
    return products.filter((p) => selected.includes(p.id));
  }, [products, selected]);

  const handleBack = () => {
    console.log("Navigating back...");
  };

  const handleNext = () => {
    console.log("Navigating next...", { profileName, selectedProducts });
  };

  return (
    <div className="container-fluid py-4">
      <div
        className="card shadow-sm border-0"
        style={{ backgroundColor: "ghostwhite" }}
      >
        <div className="card-body p-4">
          {/* Header Section */}
          <div className="mb-4">
            <h2 className="h4 mb-3 fw-bold">Basic Pricing Profile</h2>
            <div className="row g-4">
              {/* Profile Name */}
              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted">
                  Profile Name
                </label>
                <input
                  className="form-control"
                  placeholder="Enter profile name..."
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
              </div>

              <hr className="my-4 text-muted opacity-25" />

              <div className="col-md-6">
                <label className="form-label fw-semibold small text-muted d-block">
                  Selection Type
                </label>
                <div className="d-flex gap-4 mt-2">
                  {/* One Product */}
                  <div className="form-check d-flex align-items-center me-2">
                    <input
                      className="form-check-input rounded-circle me-2"
                      type="radio"
                      id="modeOne"
                      style={{
                        width: "14px",
                        height: "14px",
                        marginTop: "0",
                        backgroundColor: mode === "one" ? "#26976C" : "",
                        borderColor: mode === "one" ? "#26976C" : "",
                      }}
                      checked={mode === "one"}
                      onChange={() => setMode("one")}
                    />
                    <label className="form-check-label small" htmlFor="modeOne">
                      One Product
                    </label>
                  </div>

                  {/* Multiple */}
                  <div className="form-check d-flex align-items-center me-2">
                    <input
                      className="form-check-input rounded-circle me-2"
                      type="radio"
                      id="modeMany"
                      style={{
                        width: "14px",
                        height: "14px",
                        marginTop: "0",
                        backgroundColor: mode === "many" ? "#26976C" : "",
                        borderColor: mode === "many" ? "#26976C" : "",
                      }}
                      checked={mode === "many"}
                      onChange={() => setMode("many")}
                    />
                    <label
                      className="form-check-label small"
                      htmlFor="modeMany"
                    >
                      Multiple
                    </label>
                  </div>

                  {/* All Products */}
                  <div className="form-check d-flex align-items-center">
                    <input
                      className="form-check-input rounded-circle me-2"
                      type="radio"
                      id="modeAll"
                      style={{
                        width: "14px",
                        height: "14px",
                        marginTop: "0",
                        backgroundColor: mode === "all" ? "#26976C" : "",
                        borderColor: mode === "all" ? "#26976C" : "",
                      }}
                      checked={mode === "all"}
                      onChange={() => setMode("all")}
                    />
                    <label className="form-check-label small" htmlFor="modeAll">
                      All Products
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section - All in one line */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="h6 mb-0 fw-bold">Search & Filters</h5>
              <button
                className="btn btn-outline-danger btn-sm px-3"
                onClick={clearFilters}
                style={{ fontSize: "12px" }}
              >
                Clear Filters
              </button>
            </div>

            <div className="d-flex flex-row align-items-end gap-2 w-100">
              {/* Search */}
              <div className="flex-fill">
                <label className="form-label small text-muted mb-1">
                  Search
                </label>
                <div className="position-relative">
                  <input
                    className="form-control form-control-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Title or SKU"
                  />
                  {isSearching && (
                    <div className="position-absolute end-0 top-50 translate-middle-y me-2">
                      <div
                        className="spinner-border spinner-border-sm text-success"
                        style={{ width: "12px", height: "12px" }}
                        role="status"
                      ></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="flex-fill">
                <label className="form-label small text-muted mb-1">
                  Category
                </label>
                <select
                  className="form-select form-select-sm"
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((v) => ({ ...v, category: e.target.value }))
                  }
                >
                  <option value="">All Categories</option>
                  {filterOptions.categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Segment */}
              <div className="flex-fill">
                <label className="form-label small text-muted mb-1">
                  Segment
                </label>
                <select
                  className="form-select form-select-sm"
                  value={filters.segment}
                  onChange={(e) =>
                    setFilters((v) => ({ ...v, segment: e.target.value }))
                  }
                >
                  <option value="">All Segments</option>
                  {filterOptions.segments.map((seg) => (
                    <option key={seg} value={seg}>
                      {seg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div className="flex-fill">
                <label className="form-label small text-muted mb-1">
                  Brand
                </label>
                <select
                  className="form-select form-select-sm"
                  value={filters.brand}
                  onChange={(e) =>
                    setFilters((v) => ({ ...v, brand: e.target.value }))
                  }
                >
                  <option value="">All Brands</option>
                  {filterOptions.brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="table-responsive border rounded-3">
            <ProductTable
              products={selectableProducts}
              selected={selected}
              totalProductsCount={selectableProducts.length}
              onToggle={toggle}
              onToggleAll={toggleAll}
            />
          </div>

          {/* Bottom Preview */}
          <div className="mt-4 pt-3">
            <PricePreview products={selectedProducts} />
          </div>

          {/* Action Footer Buttons */}
          {/* Action Footer Buttons */}
          <div className="d-flex justify-content-end align-items-center gap-3 mt-5 pt-4 border-top">
            <button
              className="btn btn-outline-secondary btn-sm rounded-pill px-4 fw-semibold"
              style={{ fontSize: "13px" }}
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className="btn btn-success btn-sm rounded-pill px-4 fw-bold shadow-sm"
              style={{
                backgroundColor: "#26976C",
                borderColor: "#26976C",
                fontSize: "13px",
                paddingTop: "8px",
                paddingBottom: "8px",
              }}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
