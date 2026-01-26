import { type Product } from "../types/product";

type Props = {
  products: Product[];
  selected: string[];
  onToggle: (id: string) => void;
  onToggleAll: () => void;
};

export default function ProductTable({ products, selected, onToggle, onToggleAll }: Props) {
  const allSelected = products.length > 0 && products.every(p => selected.includes(p.id));

return (
  <div className="card border-0 shadow-sm" style={{ backgroundColor: 'ghostwhite' }}>
    <div className="card-header bg-white border-bottom-0 pt-3 d-flex justify-content-between align-items-center">
      <h5 className="mb-0 fw-bold">Products</h5>
      <button 
        className={`btn btn-sm ${allSelected ? "btn-outline-secondary" : "btn-success"}`} 
        onClick={onToggleAll}
        style={!allSelected ? { backgroundColor: '#26976C', borderColor: '#26976C' } : {}}
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
              <th className="fw-semibold">Product Details</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const checked = selected.includes(p.id);
              return (
                <tr key={p.id} className={checked ? "table-light" : ""}>
                  <td className="ps-3">
                    <input 
                      className="form-check-input shadow-none" 
                      type="checkbox" 
                      checked={checked} 
                      onChange={() => onToggle(p.id)} 
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        backgroundColor: checked ? "#26976C" : "",
                        borderColor: checked ? "#26976C" : ""
                      }}
                    />
                  </td>
                  <td>
                    {/* Vertical stack for Title and SKU */}
                    <div className="d-flex flex-column py-1">
                      <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>
                        {p.title}
                      </span>
                      <p className="mb-0 text-muted" style={{ fontSize: '11px', letterSpacing: '0.3px', fontFamily: 'monospace' }}>
                        SKU: {p.skuCode || 'N/A'}
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center py-4 text-muted small">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}