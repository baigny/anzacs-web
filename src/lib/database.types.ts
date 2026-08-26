// Hand-written types mirroring supabase/migrations/*.sql.
// Regenerate with `supabase gen types typescript` once a real project is linked.

export type AdminRole = "root_admin" | "app_admin";
export type EnquiryStatus = "new" | "contacted" | "closed";
export type CatalogSection = "hybrid" | "open_pollinated";

export interface AdminProfileRow {
  id: string;
  full_name: string;
  role: AdminRole;
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProductRow {
  id: string;
  catalog_section: CatalogSection;
  crop_type: string;
  name: string;
  slug: string;
  hero_image_url: string | null;
  region_tags: string[];
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProductAttributeRow {
  id: string;
  product_id: string;
  label: string;
  value: string;
  sort_order: number;
  created_at: string;
  deleted_at: string | null;
}

export interface KnowledgeArticleRow {
  id: string;
  title: string;
  slug: string;
  body_markdown: string;
  cover_image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TestimonialRow {
  id: string;
  name: string;
  quote: string;
  consent: boolean;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SiteCopyRow {
  key: string;
  value: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface EnquiryRow {
  id: string;
  name: string;
  mobile: string;
  crop_interest: string | null;
  product_id: string | null;
  message: string | null;
  consent: boolean;
  status: EnquiryStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ClientEventRow {
  id: string;
  event_name: string;
  meta: Record<string, unknown>;
  created_at: string;
  deleted_at: string | null;
}

export interface ServerLogRow {
  id: string;
  source: string;
  message: string;
  meta: Record<string, unknown>;
  created_at: string;
  deleted_at: string | null;
}

type TableDef<Row> = { Row: Row; Insert: Partial<Row>; Update: Partial<Row>; Relationships: [] };

export interface Database {
  public: {
    Tables: {
      admin_profiles: TableDef<AdminProfileRow>;
      products: TableDef<ProductRow>;
      product_attributes: TableDef<ProductAttributeRow>;
      knowledge_articles: TableDef<KnowledgeArticleRow>;
      testimonials: TableDef<TestimonialRow>;
      site_copy: TableDef<SiteCopyRow>;
      enquiries: TableDef<EnquiryRow>;
      client_events: TableDef<ClientEventRow>;
      server_logs: TableDef<ServerLogRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
