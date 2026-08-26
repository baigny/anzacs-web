import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchAdminProducts, softDeleteProduct } from "../api/products.api";
import type { Product } from "../types";
import { useLocalSettings } from "@/lib/useLocalSettings";

const SECTION_LABELS: Record<Product["catalogSection"], string> = {
  hybrid: "Hybrid",
  open_pollinated: "Open Pollinated",
};

export default function AdminProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [density] = useLocalSettings<"comfortable" | "compact">("admin.products.density", "comfortable");

  async function load() {
    setLoading(true);
    const data = await fetchAdminProducts();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Soft-delete this product? It will be hidden from the public site.")) return;
    await softDeleteProduct(id);
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-canopy">Products</h1>
        <Button asChild>
          <Link to="/admin/products/new">Add product</Link>
        </Button>
      </div>

      {loading ? (
        <p className="mt-6 text-center text-charcoal/60">Loading...</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-charcoal/70">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Crop</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Regions</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className={`border-t border-border ${density === "compact" ? "" : ""}`}>
                  <td className="px-4 py-3 font-semibold">{p.name}</td>
                  <td className="px-4 py-3">{p.cropType}</td>
                  <td className="px-4 py-3">{SECTION_LABELS[p.catalogSection]}</td>
                  <td className="px-4 py-3">{p.regionTags.join(", ")}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.active ? "status" : "muted"}>{p.active ? "Active" : "Inactive"}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/products/${p.id}`} className="mr-4 text-canopy underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="text-destructive underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="p-6 text-charcoal/60">No products yet.</p>}
        </div>
      )}
    </div>
  );
}
