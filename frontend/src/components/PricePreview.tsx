import { useEffect, useMemo, useState } from "react";
import type { Product, AdjustmentType, IncrementType } from "../types";

type Props = {
  products: Product[];
};

type RowState = {
  adjustment: number;
};

export default function PricePreview({ products }: Props) {
  const [basedOn, setBasedOn] = useState<"global">("global");
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>("fixed");
  const [incrementType, setIncrementType] = useState<IncrementType>("decrease");

  // Row-level adjustment values
  const [rowState, setRowState] = useState<Record<string, { adjustment: number | "" }>>({});

  // Multi-select rows
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    // Initialize row state when products change
    const initial: Record<string, RowState> = {};
    products.forEach((p) => {
      initial[p.id] = { adjustment: 0 };
    });
    setRowState(initial);
    setSelectedRows(products.map((p) => p.id));
  }, [products]);

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === products.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(products.map((p) => p.id));
    }
  };

const calcNewPrice = (base: number, adjustment: number): number => {
  if (base <= 0 || adjustment <= 0) return Number(base.toFixed(2));

  const delta =
    adjustmentType === "fixed"
      ? adjustment
      : (adjustment / 100) * base;

  const price =
    incrementType === "increase"
      ? base + delta
      : base - delta;

  return Math.max(0, Number(price.toFixed(2)));
};


  const rows = useMemo(() => {
    return products.map((product) => {
      const base = product.globalWholesalePrice ?? 0;
     const rawAdjustment = rowState[product.id]?.adjustment;
const adjustment =
  typeof rawAdjustment === "number" ? rawAdjustment : 0;

      const newPrice = calcNewPrice(base, adjustment);

      return {
        product,
        base,
        adjustment,
        newPrice,
      };
    });
  }, [products, rowState, adjustmentType, incrementType]);

  if (!products.length) return null;

  const getAdjustmentPrefix = () => {
  if (adjustmentType === "fixed" && incrementType === "increase") return "+$";
  if (adjustmentType === "fixed" && incrementType === "decrease") return "-$";
  if (adjustmentType === "dynamic" && incrementType === "increase") return "+%";
  return "-%";
};


  return (
    <div className="card">
      <h2>Price Preview</h2>

      {/* Based On */}
      <div className="row">
        <label>Based On</label>
        <select value={basedOn} onChange={() => setBasedOn("global")}>
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

      {/* Table */}
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
            <th>Product Title</th>
            <th>SKU Code</th>
            <th>Category</th>
            <th>Global Wholesale Price</th>
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
    setRowState((prev) => {
      const current = prev[r.product.id]?.adjustment;
      if (current === 0) {
        return {
          ...prev,
          [r.product.id]: { adjustment: "" },
        };
      }
      return prev;
    });
  }}
  onChange={(e) => {
    const raw = e.target.value;

    setRowState((prev) => ({
      ...prev,
      [r.product.id]: {
        adjustment:
          raw === "" ? "" : isNaN(Number(raw)) ? 0 : Number(raw),
      },
    }));
  }}
  onBlur={() => {
    setRowState((prev) => {
      const value = prev[r.product.id]?.adjustment;
      return {
        ...prev,
        [r.product.id]: {
          adjustment: value === "" ? 0 : value,
        },
      };
    });
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

      <small className="muted">
        Prices are calculated automatically. Negative values are not allowed.
      </small>
    </div>
  );
}
