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

  /* ---------------- INIT ---------------- */
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

  /* ---------------- DEBOUNCE ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRowState(rowState);
    }, 500);

    return () => clearTimeout(timer);
  }, [rowState]);

  /* ---------------- BACKEND PRICING ---------------- */
  useEffect(() => {
    if (!products.length) return;

    const rows: PricingRowPayload[] = products.map((p) => {
      const raw = rowState[p.id]?.adjustment;

      return {
        productId: p.id,
        adjustment: typeof raw === "number" ? raw : 0,
      };
    });

    previewPricing({
      adjustmentType,
      incrementType,
      rows,
    }).then((res) => {
      setPriceMap((prev) => {
        const updated = { ...prev };

        res.forEach((r) => {
          updated[r.productId] = r.newPrice;
        });

        return updated;
      });
    });
  }, [debouncedRowState, adjustmentType, incrementType, products]);

  /* ---------------- HELPERS ---------------- */
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

  /* ---------------- UI ROWS ---------------- */
  const rows = useMemo(() => {
    return products.map((product) => ({
      product,
      base: product.globalWholesalePrice ?? 0,
      newPrice: priceMap[product.id] ?? product.globalWholesalePrice ?? 0,
    }));
  }, [products, priceMap]);

  if (!products.length) return null;

  /* ---------------- RENDER ---------------- */
  return (
    <div className="card">
      <h2>Price Preview</h2>

            {/* -------- Based On -------- */}
      <div className="row">
        <label>Based On</label>
        <select>
          <option value="global">Global Wholesale Price</option>
        </select>
      </div>

      {/* Adjustment Type */}
      <div className="row">
        <label>Set Price Adjustment Mode</label>
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

      {/* Increment */}
      <div className="row">
        <label>Set Price Adjustment Increment</label>
        <div className="radioRow">
          <label>
            <input
              type="radio"
              checked={incrementType === "increase"}
              onChange={() => setIncrementType("increase")}
            />
            Increase +
          </label>
          <label>
            <input
              type="radio"
              checked={incrementType === "decrease"}
              onChange={() => setIncrementType("decrease")}
            />
            Decrease -
          </label>
        </div>
      </div>

      {/* TABLE */}
      <table className="table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedRows.length === products.length}
                onChange={toggleAll}
              />
            </th>
            <th>Product</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Base</th>
            <th>Adjustment</th>
            <th>New Price</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const checked = selectedRows.includes(r.product.id);

            return (
              <tr key={r.product.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRow(r.product.id)}
                  />
                </td>
                <td>{r.product.title}</td>
                <td>{r.product.skuCode || "-"}</td>
                <td>{r.product.categoryId || "-"}</td>
                <td>${r.base.toFixed(2)}</td>

                <td>
                  <div className="adjustment-input">
                    <span className="prefix">{getAdjustmentPrefix()}</span>
                    <input
                      type="number"
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

                <td>${r.newPrice.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
