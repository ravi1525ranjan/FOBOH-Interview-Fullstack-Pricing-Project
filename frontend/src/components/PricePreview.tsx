import { useEffect, useMemo, useState } from "react";
import type { Product, AdjustmentType, IncrementType } from "../types";
import { previewPricing } from "../api/api";

type Props = {
  products: Product[];
};

type RowState = {
  adjustment: number | "";
};

type PricingRowPayload = {
  productId: string;
  adjustment: number;
};

export default function PricePreview({ products }: Props) {
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>("fixed");
  const [incrementType, setIncrementType] = useState<IncrementType>("decrease");
  const [rowState, setRowState] = useState<Record<string, RowState>>({});
  const [debouncedRowState, setDebouncedRowState] = useState<
    Record<string, RowState>
  >({});
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [priceMap, setPriceMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const initial: Record<string, RowState> = {};
    const prices: Record<string, number> = {};
    products.forEach((p) => {
      initial[p.id] = { adjustment: 0 };
      prices[p.id] = p.globalWholesalePrice ?? 0;
    });
    setRowState(initial);
    setDebouncedRowState(initial);
    setPriceMap(prices);
    setSelectedRows(products.map((p) => p.id));
  }, [products]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRowState(rowState);
    }, 500);
    return () => clearTimeout(timer);
  }, [rowState]);

  useEffect(() => {
    if (!products.length) return;
    const rows: PricingRowPayload[] = products.map((p) => {
      const raw = rowState[p.id]?.adjustment;
      return {
        productId: p.id,
        adjustment: typeof raw === "number" ? raw : 0,
      };
    });
    previewPricing({ adjustmentType, incrementType, rows }).then((res) => {
      setPriceMap((prev) => {
        const updated = { ...prev };
        res.forEach((r) => {
          updated[r.productId] = r.newPrice;
        });
        return updated;
      });
    });
  }, [debouncedRowState, adjustmentType, incrementType, products]);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelectedRows((prev) =>
      prev.length === products.length ? [] : products.map((p) => p.id),
    );
  };

  const getAdjustmentPrefix = () => {
    if (adjustmentType === "fixed" && incrementType === "increase") return "+$";
    if (adjustmentType === "fixed" && incrementType === "decrease") return "-$";
    if (adjustmentType === "dynamic" && incrementType === "increase")
      return "+%";
    return "-%";
  };

  const rows = useMemo(() => {
    return products.map((product) => ({
      product,
      base: product.globalWholesalePrice ?? 0,
      newPrice: priceMap[product.id] ?? product.globalWholesalePrice ?? 0,
    }));
  }, [products, priceMap]);

  if (!products.length) return null;

return (
  <div
    className="card shadow-sm border-0"
    style={{ backgroundColor: "ghostwhite" }}
  >
    <div className="card-body p-4">
      <h5 className="fw-bold mb-4">Price Preview</h5>

      {/* Changed row to d-flex flex-column for vertical stacking */}
      <div className="d-flex flex-column gap-3 mb-4">
        
        {/* Based On */}
        <div className="col-md-6 col-lg-4">
          <label className="form-label small fw-semibold text-muted mb-1">
            Based On
          </label>
          <select className="form-select form-select-sm shadow-sm border-light-subtle">
            <option value="global">Global Wholesale Price</option>
          </select>
        </div>

        {/* Adjustment Mode */}
        <div className="col-md-6 col-lg-4">
          <label className="form-label small fw-semibold text-muted d-block mb-2">
            Set Price Adjustment Mode
          </label>
          <div className="d-flex gap-4">
            <div className="form-check d-flex align-items-center">
              <input
                className="form-check-input rounded-circle me-2"
                style={{
                  width: "14px",
                  height: "14px",
                  marginTop: "0",
                  backgroundColor: adjustmentType === "fixed" ? "#26976C" : "",
                  borderColor: adjustmentType === "fixed" ? "#26976C" : "",
                }}
                type="radio"
                checked={adjustmentType === "fixed"}
                onChange={() => setAdjustmentType("fixed")}
                id="fix"
              />
              <label className="form-check-label small" htmlFor="fix">
                Fixed ($)
              </label>
            </div>
            <div className="form-check d-flex align-items-center">
              <input
                className="form-check-input rounded-circle me-2"
                style={{
                  width: "14px",
                  height: "14px",
                  marginTop: "0",
                  backgroundColor: adjustmentType === "dynamic" ? "#26976C" : "",
                  borderColor: adjustmentType === "dynamic" ? "#26976C" : "",
                }}
                type="radio"
                checked={adjustmentType === "dynamic"}
                onChange={() => setAdjustmentType("dynamic")}
                id="dyn"
              />
              <label className="form-check-label small" htmlFor="dyn">
                Dynamic (%)
              </label>
            </div>
          </div>
        </div>

        {/* Increment */}
        <div className="col-md-6 col-lg-4">
          <label className="form-label small fw-semibold text-muted d-block mb-2">
            Set Price Adjustment Increment Mode
          </label>
          <div className="d-flex gap-4">
            <div className="form-check d-flex align-items-center">
              <input
                className="form-check-input rounded-circle me-2"
                style={{
                  width: "14px",
                  height: "14px",
                  marginTop: "0",
                  backgroundColor: incrementType === "increase" ? "#26976C" : "",
                  borderColor: incrementType === "increase" ? "#26976C" : "",
                }}
                type="radio"
                checked={incrementType === "increase"}
                onChange={() => setIncrementType("increase")}
                id="inc"
              />
              <label className="form-check-label small" htmlFor="inc">
                Increase +
              </label>
            </div>
            <div className="form-check d-flex align-items-center">
              <input
                className="form-check-input rounded-circle me-2"
                style={{
                  width: "14px",
                  height: "14px",
                  marginTop: "0",
                  backgroundColor: incrementType === "decrease" ? "#26976C" : "",
                  borderColor: incrementType === "decrease" ? "#26976C" : "",
                }}
                type="radio"
                checked={incrementType === "decrease"}
                onChange={() => setIncrementType("decrease")}
                id="dec"
              />
              <label className="form-check-label small" htmlFor="dec">
                Decrease -
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-responsive rounded border">
                  <table className="table table-hover align-middle mb-0 small">
            <thead className="table-light">
              <tr>
                <th style={{ width: "40px" }} className="ps-3">
                  <input
                    className="form-check-input shadow-none"
                    type="checkbox"
                    style={{
                      width: "16px",
                      height: "16px",
                      cursor: "pointer",
                      borderRadius: "4px",
                      backgroundColor:
                        selectedRows.length === products.length &&
                        products.length > 0
                          ? "#26976C"
                          : "",
                      borderColor:
                        selectedRows.length === products.length &&
                        products.length > 0
                          ? "#26976C"
                          : "",
                    }}
                    checked={
                      selectedRows.length === products.length &&
                      products.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Base</th>
                <th style={{ width: "150px" }}>Adjustment</th>
                <th className="text-end pe-3">New Price</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const checked = selectedRows.includes(r.product.id);
                return (
                  <tr
                    key={r.product.id}
                    className={checked ? "table-light" : ""}
                  >
                    <td className="ps-3">
                      <input
                        className="form-check-input shadow-none"
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRow(r.product.id)}
                        style={{
                          width: "16px",
                          height: "16px",
                          cursor: "pointer",
                          borderRadius: "4px",
                          backgroundColor: checked ? "#26976C" : "",
                          borderColor: checked ? "#26976C" : "",
                        }}
                      />
                    </td>
                    {/* Title remains neutral */}
                    <td className="fw-semibold text-dark">{r.product.title}</td>
                    <td className="text-muted">{r.product.skuCode || "-"}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {r.product.categoryId || "General"}
                      </span>
                    </td>
                    <td className="text-muted">${r.base.toFixed(2)}</td>
                    <td>
                      <div className="input-group input-group-sm">
                        <span className="input-group-text bg-white">
                          {getAdjustmentPrefix()}
                        </span>
                        <input
                          type="number"
                          className="form-control"
                          step="0.01"
                          value={rowState[r.product.id]?.adjustment ?? ""}
                          onFocus={() => {
                            if (rowState[r.product.id]?.adjustment === 0) {
                              setRowState((prev) => ({
                                ...prev,
                                [r.product.id]: { adjustment: "" },
                              }));
                            }
                          }}
                          onChange={(e) => {
                            const raw = e.target.value;
                            setRowState((prev) => ({
                              ...prev,
                              [r.product.id]: {
                                adjustment:
                                  raw === ""
                                    ? ""
                                    : isNaN(Number(raw))
                                      ? 0
                                      : Number(raw),
                              },
                            }));
                          }}
                          onBlur={() => {
                            if (rowState[r.product.id]?.adjustment === "") {
                              setRowState((prev) => ({
                                ...prev,
                                [r.product.id]: { adjustment: 0 },
                              }));
                            }
                          }}
                        />
                      </div>
                    </td>
                    <td className="text-end pe-3 fw-bold text-success">
                      ${r.newPrice.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
      </div>
    </div>
  </div>
);
}
