import { useEffect, useMemo, useState } from "react";
import type {
  Product,
  AdjustmentType,
  IncrementType,
  PricingProfile,
} from "../types";
import {
  previewPricing,
  savePricingProfile,
  fetchPricingProfiles,
} from "../api/api";

type Props = {
  products: Product[];
  profileName: string;
};

type RowState = {
  adjustment: number | "";
};

type PricingRowPayload = {
  productId: string;
  adjustment: number;
};

export default function PricePreview({ products, profileName }: Props) {
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>("fixed");
  const [incrementType, setIncrementType] = useState<IncrementType>("decrease");
  const [rowState, setRowState] = useState<Record<string, RowState>>({});
  const [debouncedRowState, setDebouncedRowState] = useState<Record<string, RowState>>({});
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});

  const [savedProfiles, setSavedProfiles] = useState<PricingProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("global");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch profiles on mount
  useEffect(() => {
    fetchPricingProfiles().then(setSavedProfiles).catch(console.error);
  }, []);

  // Filter profiles
  const availableProfiles = useMemo(() => {
    const currentProductIds = products.map((p) => p.id);
    return savedProfiles.filter((profile) =>
      profile.items.some((item) => currentProductIds.includes(item.productId))
    );
  }, [products, savedProfiles]);

  const getBasePrice = (product: Product) => {
    if (selectedProfileId === "global") {
      return product.globalWholesalePrice ?? 0;
    }
    const profile = availableProfiles.find((p) => p.id === selectedProfileId);
    const savedItem = profile?.items.find((i) => i.productId === product.id);
    return savedItem ? savedItem.adjustment : (product.globalWholesalePrice ?? 0);
  };

  useEffect(() => {
    const resetRowState: Record<string, RowState> = {};
    const resetPrices: Record<string, number> = {};

    products.forEach((p) => {
      const base = getBasePrice(p);
      resetRowState[p.id] = { adjustment: 0 };
      resetPrices[p.id] = base;
    });

    setRowState(resetRowState);
    setPriceMap(resetPrices);
    // Initially select all based on incoming products
    setSelectedRows(products.map((p) => p.id));
  }, [selectedProfileId, products]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRowState(rowState);
    }, 500);
    return () => clearTimeout(timer);
  }, [rowState]);

  useEffect(() => {
    if (!products.length) return;

    const rows: PricingRowPayload[] = products.map((p) => ({
      productId: p.id,
      adjustment: typeof rowState[p.id]?.adjustment === "number" ? (rowState[p.id]?.adjustment as number) : 0,
    }));

    previewPricing({ adjustmentType, incrementType, rows }).then((res) => {
      setPriceMap((prev) => {
        const updated = { ...prev };
        res.forEach((r) => {
          const product = products.find((p) => p.id === r.productId);
          if (!product) return;
          const base = getBasePrice(product);
          const userAdjustment = typeof rowState[r.productId]?.adjustment === "number" ? (rowState[r.productId]?.adjustment as number) : 0;

          if (userAdjustment === 0) {
            updated[r.productId] = base;
          } else {
            let calculatedPrice = base;
            if (adjustmentType === "fixed") {
              calculatedPrice = incrementType === "increase" ? base + userAdjustment : base - userAdjustment;
            } else {
              const percentage = userAdjustment / 100;
              calculatedPrice = incrementType === "increase" ? base * (1 + percentage) : base * (1 - percentage);
            }
            updated[r.productId] = calculatedPrice;
          }
        });
        return updated;
      });
    });
  }, [debouncedRowState, adjustmentType, incrementType, products, selectedProfileId]);

  const handleSaveProfile = async () => {
    if (!profileName.trim()) {
      alert("Please enter a profile name first.");
      return;
    }
    const confirmSave = window.confirm(`Save profile: "${profileName}"?`);
    if (!confirmSave) return;

    setIsSaving(true);
    const payload: any = {
      name: profileName,
      basedOnProfileId: selectedProfileId === "global" ? null : selectedProfileId,
      items: products.map((p) => {
        const currentPrice = priceMap[p.id] ?? getBasePrice(p);
        const rawInput = rowState[p.id]?.adjustment;
        return {
          productId: p.id,
          adjustment: currentPrice,
          adjustmentType: adjustmentType,
          incrementType: incrementType,
          adjustmentValue: typeof rawInput === "number" ? rawInput : 0,
        };
      }),
    };

    try {
      await savePricingProfile(payload);
      alert("Profile saved successfully!");
      window.location.reload();
    } catch (error) {
      alert("Error saving profile.");
      setIsSaving(false);
    }
  };

  const getAdjustmentPrefix = () => {
    if (adjustmentType === "fixed" && incrementType === "increase") return "+$";
    if (adjustmentType === "fixed" && incrementType === "decrease") return "-$";
    if (adjustmentType === "dynamic" && incrementType === "increase") return "+%";
    return "-%";
  };

  /**
   * Logic Update: Intercept uncheck action
   */
  const toggleRow = (id: string) => {
    if (selectedRows.includes(id)) {
      alert("This product is currently selected in your list. If you want to remove it from the Bespoke pricing section, please remove it from the main product table first.");
      return; // Stop the unselection
    }
    setSelectedRows((prev) => [...prev, id]);
  };

  /**
   * Logic Update: Intercept "Select All" uncheck action
   */
  const toggleAll = () => {
    if (selectedRows.length === products.length) {
      alert("All products are currently selected. To remove products from this section, please unselect them from the main product table.");
      return; // Stop the unselection of all
    }
    setSelectedRows(products.map((p) => p.id));
  };

  const rows = useMemo(() => {
    return products.map((product) => {
      const base = getBasePrice(product);
      return {
        product,
        base,
        newPrice: priceMap[product.id] ?? base,
      };
    });
  }, [products, priceMap, selectedProfileId]);

  if (!products.length) return null;

  return (
    <>
      <style>{`
        .form-check-input:checked {
          background-color: #26976C !important;
          border-color: #26976C !important;
        }
        .form-check-input:focus {
          box-shadow: 0 0 0 0.25rem rgba(38, 151, 108, 0.25) !important;
          border-color: #26976C !important;
        }
      `}</style>

      <div className="card shadow-sm border-0" style={{ backgroundColor: "ghostwhite" }}>
        <div className="card-body p-4">
          <div className="mb-4">
            <h5 className="fw-bold mb-0">Bespoke Product Price</h5>
          </div>

          <div className="d-flex flex-column gap-3 mb-4">
            <div className="col-md-6 col-lg-4">
              <label className="form-label small fw-semibold text-muted mb-1">Based On</label>
              <select className="form-select form-select-sm" value={selectedProfileId} onChange={(e) => setSelectedProfileId(e.target.value)}>
                <option value="global">Global Wholesale Price</option>
                {availableProfiles.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6 col-lg-4">
              <label className="form-label small fw-semibold text-muted d-block mb-2">Set Price Adjustment Mode</label>
              <div className="d-flex gap-4">
                <div className="form-check d-flex align-items-center">
                  <input className="form-check-input me-2" type="radio" name="adjMode" checked={adjustmentType === "fixed"} onChange={() => setAdjustmentType("fixed")} id="fix" />
                  <label className="form-check-label small" htmlFor="fix">Fixed ($)</label>
                </div>
                <div className="form-check d-flex align-items-center">
                  <input className="form-check-input me-2" type="radio" name="adjMode" checked={adjustmentType === "dynamic"} onChange={() => setAdjustmentType("dynamic")} id="dyn" />
                  <label className="form-check-label small" htmlFor="dyn">Dynamic (%)</label>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <label className="form-label small fw-semibold text-muted d-block mb-2">Set Price Adjustment Increment Mode</label>
              <div className="d-flex gap-4">
                <div className="form-check d-flex align-items-center">
                  <input className="form-check-input me-2" type="radio" name="incMode" checked={incrementType === "increase"} onChange={() => setIncrementType("increase")} id="inc" />
                  <label className="form-check-label small" htmlFor="inc">Increase +</label>
                </div>
                <div className="form-check d-flex align-items-center">
                  <input className="form-check-input me-2" type="radio" name="incMode" checked={incrementType === "decrease"} onChange={() => setIncrementType("decrease")} id="dec" />
                  <label className="form-check-label small" htmlFor="dec">Decrease -</label>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive rounded border bg-white mb-3">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">
                    <input className="form-check-input" type="checkbox" checked={selectedRows.length === products.length} onChange={toggleAll} />
                  </th>
                  <th>Product Title</th>
                  <th>SKU Code</th>
                  <th>Category</th>
                  <th>{selectedProfileId === "global" ? "Global Price" : "Base Price"}</th>
                  <th style={{ width: "150px" }}>Adjustment</th>
                  <th className="text-end pe-3">New Price</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const checked = selectedRows.includes(r.product.id);
                  return (
                    <tr key={r.product.id} className={checked ? "table-light" : ""}>
                      <td className="ps-3">
                        <input className="form-check-input" type="checkbox" checked={checked} onChange={() => toggleRow(r.product.id)} />
                      </td>
                      <td className="fw-semibold text-dark">{r.product.title}</td>
                      <td className="text-muted">{r.product.skuCode || "-"}</td>
                      <td><span className="badge bg-light text-dark border">{r.product.categoryId || "General"}</span></td>
                      <td className="text-muted">${r.base.toFixed(2)}</td>
                      <td>
                        <div className="input-group input-group-sm">
                          <span className="input-group-text bg-white">{getAdjustmentPrefix()}</span>
                          <input
                            type="number"
                            className="form-control"
                            value={rowState[r.product.id]?.adjustment ?? ""}
                            onFocus={() => { if (rowState[r.product.id]?.adjustment === 0) setRowState((prev) => ({ ...prev, [r.product.id]: { adjustment: "" } })); }}
                            onChange={(e) => {
                              const raw = e.target.value;
                              setRowState((prev) => ({ ...prev, [r.product.id]: { adjustment: raw === "" ? "" : Number(raw) } }));
                            }}
                            onBlur={() => { if (rowState[r.product.id]?.adjustment === "") setRowState((prev) => ({ ...prev, [r.product.id]: { adjustment: 0 } })); }}
                          />
                        </div>
                      </td>
                      <td className="text-end pe-3 fw-bold text-success">${r.newPrice.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-success btn-sm px-4 fw-bold shadow-sm"
              style={{ backgroundColor: "#26976C", borderColor: "#26976C" }}
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}