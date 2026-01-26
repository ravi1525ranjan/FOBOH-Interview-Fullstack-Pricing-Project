import { type Product } from "../types/product";

type Props = {
  products: Product[];
  totalProductsCount: number;
  selected: string[];
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  mode: "one" | "many" | "all"; 
};

export default function ProductTable({
  products,
  totalProductsCount,
  selected,
  onToggle,
  onToggleAll,
  mode
}: Props) {
  const visibleSelectedCount = products.filter((p) =>
    selected.includes(p.id),
  ).length;

  const allSelected =
    products.length > 0 && products.every((p) => selected.includes(p.id));

  return (
    <div
      className="card border-0 shadow-sm"
      style={{ backgroundColor: "ghostwhite" }}
    >
      <div className="card-header bg-white border-bottom-0 pt-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <h5 className="mb-0 fw-bold">Products</h5>
          <span
            className="badge rounded-pill bg-light text-muted border fw-normal"
            style={{ fontSize: "12px" }}
          >
            {products.length} of {totalProductsCount}
          </span>
        </div>
        <button
          className={`btn btn-sm ${allSelected ? "btn-outline-secondary" : "btn-success"}`}
          onClick={onToggleAll}
          // Disabled removed from here
          style={
            !allSelected
              ? { backgroundColor: "#26976C", borderColor: "#26976C" }
              : {}
          }
        >
          {allSelected ? "Unselect All" : "Select All"}
        </button>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "40px" }} className="ps-3"></th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const checked = selected.includes(p.id);
                return (
                  <tr key={p.id} className={checked ? "table-light" : ""}>
                    <td className="ps-3">
                      <input
                        className="form-check-input shadow-none"
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle(p.id)}
                        // Disabled removed from here
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                          borderRadius: "4px",
                          backgroundColor: checked ? "#26976C" : "",
                          borderColor: checked ? "#26976C" : "",
                        }}
                      />
                    </td>
                    <td style={{ width: "60px" }}>
                      <div className="rounded border bg-white d-flex align-items-center justify-content-center" style={{ width: "45px", height: "45px", overflow: "hidden" }}>
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <span className="text-muted" style={{ fontSize: "10px" }}>No Img</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column py-1">
                        <span className="fw-medium text-dark" style={{ fontSize: "14px", lineHeight: "1.2" }}>{p.title}</span>
                        <p className="mb-0 text-muted" style={{ fontSize: "11px", fontFamily: "monospace", marginTop: "2px" }}>
                          SKU: {p.skuCode || "N/A"}
                        </p>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {products.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-muted small">
                    {mode === "all" ? "No products found." : "Search or filter to customize pricing for specific products, If left unselected, global wholesale pricing applies."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-footer bg-white border-top-1 py-3" style={{ borderColor: "#f0f0f0" }}>
        <div className="d-flex align-items-center">
          {visibleSelectedCount > 0 ? (
            <small className="text-muted fw-medium">
              You've selected <span className="text-dark fw-bold">{visibleSelectedCount}</span> {visibleSelectedCount === 1 ? "Product" : "Products"}
            </small>
          ) : (
            <small className="text-muted italic">
              {mode === "all" ? "All products are currently selected" : "No product is selected."}
            </small>
          )}
        </div>
      </div>
    </div>
  );
}