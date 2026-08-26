import type { CatalogSection } from "@/lib/database.types";

export interface ProductAttribute {
  id: string;
  label: string;
  value: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  catalogSection: CatalogSection;
  cropType: string;
  name: string;
  slug: string;
  heroImageUrl: string | null;
  regionTags: string[];
  active: boolean;
  sortOrder: number;
  attributes: ProductAttribute[];
}

export interface ProductFilters {
  search?: string;
  cropType?: string;
  region?: string;
}

export const REGION_OPTIONS = ["South", "Central", "North", "Pan India"] as const;
export type Region = (typeof REGION_OPTIONS)[number];
