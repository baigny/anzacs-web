import { supabase } from "@/lib/supabase";
import { withActiveOnly } from "@/lib/withActiveOnly";
import type { ProductAttributeRow, ProductRow } from "@/lib/database.types";
import type { Product, ProductAttribute } from "../types";

function mapAttribute(row: ProductAttributeRow): ProductAttribute {
  return { id: row.id, label: row.label, value: row.value, sortOrder: row.sort_order };
}

function mapProduct(row: ProductRow, attributes: ProductAttributeRow[] = []): Product {
  return {
    id: row.id,
    catalogSection: row.catalog_section,
    cropType: row.crop_type,
    name: row.name,
    slug: row.slug,
    heroImageUrl: row.hero_image_url,
    regionTags: row.region_tags ?? [],
    active: row.active,
    sortOrder: row.sort_order,
    attributes: attributes
      .filter((a) => a.product_id === row.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapAttribute),
  };
}

/** Public: active, non-deleted products with their attributes. */
export async function fetchPublicProducts(): Promise<Product[]> {
  const productsQuery = withActiveOnly(
    supabase.from("products").select("*") as any,
    { flagColumn: "active" },
  ).order("sort_order", { ascending: true });

  const { data: products, error } = await productsQuery;
  if (error) throw error;

  const ids = (products ?? []).map((p: ProductRow) => p.id);
  if (ids.length === 0) return [];

  const { data: attrs, error: attrError } = await withActiveOnly(
    supabase.from("product_attributes").select("*").in("product_id", ids) as any,
  );
  if (attrError) throw attrError;

  return (products as ProductRow[]).map((p) => mapProduct(p, (attrs ?? []) as ProductAttributeRow[]));
}

/** Public: single product by slug. */
export async function fetchPublicProductBySlug(slug: string): Promise<Product | null> {
  const { data: product, error } = await withActiveOnly(
    supabase.from("products").select("*").eq("slug", slug) as any,
    { flagColumn: "active" },
  ).maybeSingle();
  if (error) throw error;
  if (!product) return null;

  const { data: attrs } = await withActiveOnly(
    supabase.from("product_attributes").select("*").eq("product_id", product.id) as any,
  );
  return mapProduct(product as ProductRow, (attrs ?? []) as ProductAttributeRow[]);
}

/** Admin: all non-deleted products (active and inactive) for the admin list view. */
export async function fetchAdminProducts(): Promise<Product[]> {
  const { data: products, error } = await withActiveOnly(
    supabase.from("products").select("*") as any,
  ).order("sort_order", { ascending: true });
  if (error) throw error;

  const ids = (products ?? []).map((p: ProductRow) => p.id);
  const { data: attrs } = ids.length
    ? await withActiveOnly(
        supabase.from("product_attributes").select("*").in("product_id", ids) as any,
      )
    : { data: [] as ProductAttributeRow[] };

  return (products as ProductRow[]).map((p) => mapProduct(p, (attrs ?? []) as ProductAttributeRow[]));
}

export interface ProductInput {
  catalogSection: Product["catalogSection"];
  cropType: string;
  name: string;
  slug: string;
  heroImageUrl: string | null;
  regionTags: string[];
  active: boolean;
  sortOrder: number;
  attributes: Array<{ label: string; value: string; sortOrder: number }>;
}

export async function createProduct(input: ProductInput): Promise<string> {
  const { data, error } = await supabase
    .from("products")
    .insert({
      catalog_section: input.catalogSection,
      crop_type: input.cropType,
      name: input.name,
      slug: input.slug,
      hero_image_url: input.heroImageUrl,
      region_tags: input.regionTags,
      active: input.active,
      sort_order: input.sortOrder,
    })
    .select("id")
    .single();
  if (error) throw error;

  if (input.attributes.length > 0) {
    const { error: attrError } = await supabase.from("product_attributes").insert(
      input.attributes.map((a) => ({
        product_id: data.id,
        label: a.label,
        value: a.value,
        sort_order: a.sortOrder,
      })),
    );
    if (attrError) throw attrError;
  }

  return data.id;
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  const { error } = await supabase
    .from("products")
    .update({
      catalog_section: input.catalogSection,
      crop_type: input.cropType,
      name: input.name,
      slug: input.slug,
      hero_image_url: input.heroImageUrl,
      region_tags: input.regionTags,
      active: input.active,
      sort_order: input.sortOrder,
    })
    .eq("id", id);
  if (error) throw error;

  // Replace attribute rows: soft-delete existing, insert fresh set.
  const { data: existing, error: fetchErr } = await supabase
    .from("product_attributes")
    .select("id")
    .eq("product_id", id)
    .is("deleted_at", null);
  if (fetchErr) throw fetchErr;

  if (existing && existing.length > 0) {
    const { error: softDeleteErr } = await supabase
      .from("product_attributes")
      .update({ deleted_at: new Date().toISOString() })
      .in(
        "id",
        existing.map((e) => e.id),
      );
    if (softDeleteErr) throw softDeleteErr;
  }

  if (input.attributes.length > 0) {
    const { error: insertErr } = await supabase.from("product_attributes").insert(
      input.attributes.map((a) => ({
        product_id: id,
        label: a.label,
        value: a.value,
        sort_order: a.sortOrder,
      })),
    );
    if (insertErr) throw insertErr;
  }
}

/** Soft delete only -- never a hard DELETE. */
export async function softDeleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}
