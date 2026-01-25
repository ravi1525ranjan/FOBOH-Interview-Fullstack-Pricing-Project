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
    <div className="card">
      <div className="card-header">
        <h2>Products</h2>
        <button className="btn" onClick={onToggleAll}>
          {allSelected ? "Unselect All" : "Select All"}
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            {/* <th>SKU</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Segment</th> */}
            <th>Base Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => {
            const checked = selected.includes(p.id);
            return (
              <tr key={p.id}>
                <td>
                  <input type="checkbox" checked={checked} onChange={() => onToggle(p.id)} />
                </td>
                <td>{p.title}</td>
                {/* <td>{p.sku}</td>
                <td>{p.brand}</td>
                <td>{p.category}</td>
                <td>{p.subCategory}</td>
                <td>{p.segment}</td> */}
                <td>${p.basePrice?.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
