import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { fetchPublicProducts } from "../api/products.api";
import { ProductCard } from "./ProductCard";
import { REGION_OPTIONS, type Product } from "../types";
import { trackEvent } from "@/lib/trackEvent";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [cropType, setCropType] = useState<string>("all");
  const [region, setRegion] = useState<string>("all");
  const [searchParams] = useSearchParams();
  const sectionFilter = searchParams.get("section");

  useEffect(() => {
    trackEvent("page_view", { page: "products" });
    fetchPublicProducts()
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const cropTypes = useMemo(
    () => Array.from(new Set(products.map((p) => p.cropType))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (sectionFilter && p.catalogSection !== sectionFilter) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.cropType.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (cropType !== "all" && p.cropType !== cropType) return false;
      if (region !== "all" && !p.regionTags.includes(region)) return false;
      return true;
    });
  }, [products, search, cropType, region, sectionFilter]);

  function clearFilters() {
    setSearch("");
    setCropType("all");
    setRegion("all");
  }

  return (
    <div className="container py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-dark">Our Seeds</p>
      <h1 className="mt-2 text-3xl font-bold text-canopy md:text-4xl">Products</h1>
      <p className="mt-3 max-w-2xl text-charcoal/80">
        Browse our hybrid and open-pollinated seed catalog. Filter by crop type or region to find
        the right variety for your farm.
      </p>

      <div
        className="mt-8 flex flex-col gap-3 rounded-lg border border-border bg-white p-4 md:flex-row md:items-center"
        role="search"
        aria-label="Filter products"
      >
        <label className="sr-only" htmlFor="product-search">
          Search products
        </label>
        <Input
          id="product-search"
          placeholder="Search by name or crop..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            trackEvent("product_filter_use", { type: "search" });
          }}
          className="md:max-w-xs"
        />

        <Select
          value={cropType}
          onValueChange={(v) => {
            setCropType(v);
            trackEvent("product_filter_use", { type: "cropType", value: v });
          }}
        >
          <SelectTrigger className="md:w-48" aria-label="Filter by crop type">
            <SelectValue placeholder="Crop type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All crop types</SelectItem>
            {cropTypes.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={region}
          onValueChange={(v) => {
            setRegion(v);
            trackEvent("product_filter_use", { type: "region", value: v });
          }}
        >
          <SelectTrigger className="md:w-48" aria-label="Filter by region">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All regions</SelectItem>
            {REGION_OPTIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="ghost" size="sm" onClick={clearFilters} type="button">
          Clear filters
        </Button>
      </div>

      {loading && <p className="mt-8 text-charcoal/60">Loading products...</p>}
      {error && <p role="alert" className="mt-8 text-destructive">{error}</p>}

      {!loading && !error && (
        <>
          <p className="mt-6 text-sm text-charcoal/60" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "product" : "products"} found
          </p>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="mt-8 text-charcoal/60">No products match your filters.</p>
          )}
        </>
      )}
    </div>
  );
}
