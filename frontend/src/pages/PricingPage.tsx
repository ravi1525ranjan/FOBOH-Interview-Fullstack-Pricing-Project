import { useEffect, useMemo, useState } from "react";
import type { Product } from "../types/product";
import { fetchProducts } from "../api/api";
import ProductTable from "../components/ProductTable";
import PricePreview from "../components/PricePreview";

type SelectionMode = "one" | "many" | "all";

export default function PricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [mode, setMode] = useState<SelectionMode>("all");
  const [selectionError, setSelectionError] = useState<string | null>(null); // New state for popup
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    segment: "",
    brand: "",
  });

  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  // Clear error message after 4 seconds
  useEffect(() => {
    if (selectionError) {
      const timer = setTimeout(() => setSelectionError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [selectionError]);

  const isFilterActive = useMemo(() => {
    return (
      debouncedSearch.trim() !== "" ||
      filters.category !== "" ||
      filters.segment !== "" ||
      filters.brand !== ""
    );
  }, [debouncedSearch, filters]);

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

  const filteredProductsList = useMemo(() => {
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

  const selectableProducts = useMemo(() => {
    if (mode === "all") return products;
    if (isFilterActive) return filteredProductsList;
    return [];
  }, [mode, products, isFilterActive, filteredProductsList]);

  const clearFilters = () => {
    setSearch("");
    setFilters({ category: "", segment: "", brand: "" });
  };

  const toggle = (id: string) => {
    setSelected((prev) => {
      const isAlreadySelected = prev.includes(id);

      if (mode === "one" && !isAlreadySelected && prev.length >= 1) {
        setSelectionError(
          "You have selected 'One Product' selection type. To select multiple, please change the Selection Type above.",
        );
        return prev;
      }

      return isAlreadySelected ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  const toggleAll = () => {
    if (mode === "one") {
      setSelectionError(
        "Bulk selection is not allowed in 'One Product' selection type mode.",
      );
      return;
    }
    const allIds = selectableProducts.map((p) => p.id);
    const allSelected = allIds.every((id) => selected.includes(id));
    setSelected(allSelected ? [] : allIds);
  };

  useEffect(() => {
    if (mode === "all") {
      setSelected(products.map((p) => p.id));
      clearFilters();
    } else {
      setSelected([]);
    }
    setSelectionError(null);
  }, [mode, products]);

  const selectedProducts = useMemo(() => {
    return products.filter((p) => selected.includes(p.id));
  }, [products, selected]);

  const handleBack = () => console.log("Navigating back...");
  const handleNext = () =>
    console.log("Navigating next...", { profileName, selectedProducts });

  return (
    <div className="container-fluid py-4">
      <div
        className="card shadow-sm border-0"
        style={{ backgroundColor: "ghostwhite" }}
      >
        <div className="card-body p-4">
          {/* Error Message Popup */}
          {selectionError && (
            <div
              className="alert alert-danger border-0 shadow-sm d-flex align-items-center animate__animated animate__fadeInDown"
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 9999,
                maxWidth: "400px",
              }}
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <small>{selectionError}</small>
              <button
                type="button"
                className="btn-close ms-auto shadow-none"
                style={{ fontSize: "0.8rem" }}
                onClick={() => setSelectionError(null)}
              ></button>
            </div>
          )}

          <div className="mb-4">
            <h2 className="h4 mb-3 fw-bold">Basic Pricing Profile</h2>
            <div className="row g-4">
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
                  {["one", "many", "all"].map((m) => (
                    <div
                      key={m}
                      className="form-check d-flex align-items-center me-2"
                    >
                      <input
                        className="form-check-input rounded-circle me-2"
                        type="radio"
                        id={`mode${m}`}
                        style={{
                          width: "14px",
                          height: "14px",
                          marginTop: "0",
                          backgroundColor: mode === m ? "#26976C" : "",
                          borderColor: mode === m ? "#26976C" : "",
                        }}
                        checked={mode === m}
                        onChange={() => setMode(m as SelectionMode)}
                      />
                      <label
                        className="form-check-label small text-capitalize"
                        htmlFor={`mode${m}`}
                      >
                        {m === "many"
                          ? "Multiple"
                          : m === "one"
                            ? "One Product"
                            : "All Products"}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`mb-4 ${mode === "all" ? "opacity-50" : ""}`}
            style={{ pointerEvents: mode === "all" ? "none" : "auto" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="h6 mb-0 fw-bold">Search & Filters</h5>
              <button
                className="btn btn-outline-danger btn-sm px-3"
                onClick={clearFilters}
                disabled={mode === "all"}
                style={{ fontSize: "12px" }}
              >
                Clear Filters
              </button>
            </div>

            <div className="d-flex flex-row align-items-end gap-2 w-100">
              <div className="flex-fill">
                <label className="form-label small text-muted mb-1">
                  Search
                </label>
                <input
                  className="form-control form-control-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Title or SKU"
                />
              </div>

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
                  {filterOptions.brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="table-responsive border rounded-3">
            <ProductTable
              products={selectableProducts}
              selected={selected}
              totalProductsCount={
                mode === "all" ? products.length : selectableProducts.length
              }
              onToggle={toggle}
              onToggleAll={toggleAll}
              mode={mode}
            />
          </div>

          <div className="mt-4 pt-3">
            <PricePreview
              products={selectedProducts}
              profileName={profileName}
            />
          </div>

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
                padding: "8px 24px",
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
