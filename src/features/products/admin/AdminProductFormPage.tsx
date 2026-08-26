import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  createProduct,
  fetchAdminProducts,
  updateProduct,
  type ProductInput,
} from "../api/products.api";
import { REGION_OPTIONS } from "../types";

const EMPTY_ATTR = { label: "", value: "", sortOrder: 0 };

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState<ProductInput>({
    catalogSection: "hybrid",
    cropType: "",
    name: "",
    slug: "",
    heroImageUrl: "",
    regionTags: [],
    active: true,
    sortOrder: 0,
    attributes: [{ ...EMPTY_ATTR }],
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew || !id) return;
    fetchAdminProducts().then((all) => {
      const existing = all.find((p) => p.id === id);
      if (existing) {
        setForm({
          catalogSection: existing.catalogSection,
          cropType: existing.cropType,
          name: existing.name,
          slug: existing.slug,
          heroImageUrl: existing.heroImageUrl ?? "",
          regionTags: existing.regionTags,
          active: existing.active,
          sortOrder: existing.sortOrder,
          attributes: existing.attributes.length
            ? existing.attributes.map((a) => ({ label: a.label, value: a.value, sortOrder: a.sortOrder }))
            : [{ ...EMPTY_ATTR }],
        });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function toggleRegion(region: string) {
    setForm((f) => ({
      ...f,
      regionTags: f.regionTags.includes(region)
        ? f.regionTags.filter((r) => r !== region)
        : [...f.regionTags, region],
    }));
  }

  function updateAttr(index: number, patch: Partial<{ label: string; value: string }>) {
    setForm((f) => ({
      ...f,
      attributes: f.attributes.map((a, i) => (i === index ? { ...a, ...patch } : a)),
    }));
  }

  function addAttr() {
    setForm((f) => ({ ...f, attributes: [...f.attributes, { label: "", value: "", sortOrder: f.attributes.length }] }));
  }

  function removeAttr(index: number) {
    setForm((f) => ({ ...f, attributes: f.attributes.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.slug.trim() || !form.cropType.trim()) {
      setError("Name, slug, and crop type are required.");
      return;
    }
    setSaving(true);
    try {
      const cleanAttrs = form.attributes
        .filter((a) => a.label.trim() && a.value.trim())
        .map((a, i) => ({ ...a, sortOrder: i }));
      const payload: ProductInput = { ...form, attributes: cleanAttrs };
      if (isNew) {
        await createProduct(payload);
      } else if (id) {
        await updateProduct(id, payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-center text-charcoal/60">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-canopy">{isNew ? "Add product" : "Edit product"}</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-name">Name</Label>
            <Input id="p-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-slug">Slug</Label>
            <Input id="p-slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-crop">Crop type</Label>
            <Input id="p-crop" value={form.cropType} onChange={(e) => setForm((f) => ({ ...f, cropType: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-section">Catalog section</Label>
            <select
              id="p-section"
              className="h-11 rounded-md border border-border bg-white px-3 text-sm"
              value={form.catalogSection}
              onChange={(e) => setForm((f) => ({ ...f, catalogSection: e.target.value as ProductInput["catalogSection"] }))}
            >
              <option value="hybrid">Hybrid</option>
              <option value="open_pollinated">Open Pollinated</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="p-image">Hero image URL</Label>
          <Input
            id="p-image"
            value={form.heroImageUrl ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, heroImageUrl: e.target.value }))}
            placeholder="https://..."
          />
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-charcoal">Region tags</legend>
          <div className="mt-2 flex flex-wrap gap-4">
            {REGION_OPTIONS.map((region) => (
              <label key={region} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.regionTags.includes(region)}
                  onCheckedChange={() => toggleRegion(region)}
                />
                {region}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex items-center gap-2">
          <Checkbox
            id="p-active"
            checked={form.active}
            onCheckedChange={(v) => setForm((f) => ({ ...f, active: v === true }))}
          />
          <Label htmlFor="p-active" className="font-normal">Active (visible on public site)</Label>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-charcoal">
            Agronomy attributes (repeatable, not a fixed count)
          </legend>
          <div className="mt-2 flex flex-col gap-3">
            {form.attributes.map((attr, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Label (e.g. Maturity Duration)"
                  value={attr.label}
                  onChange={(e) => updateAttr(i, { label: e.target.value })}
                />
                <Input
                  placeholder="Value (e.g. 55-60 days)"
                  value={attr.value}
                  onChange={(e) => updateAttr(i, { value: e.target.value })}
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeAttr(i)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline-dark" size="sm" onClick={addAttr} className="self-start">
              Add attribute
            </Button>
          </div>
        </fieldset>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save product"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate("/admin/products")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
