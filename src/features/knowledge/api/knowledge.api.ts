import { supabase } from "@/lib/supabase";
import { withActiveOnly } from "@/lib/withActiveOnly";
import type { KnowledgeArticleRow } from "@/lib/database.types";
import type { KnowledgeArticle } from "../types";

function mapArticle(row: KnowledgeArticleRow): KnowledgeArticle {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    bodyMarkdown: row.body_markdown,
    coverImageUrl: row.cover_image_url,
    published: row.published,
  };
}

export async function fetchPublicArticles(): Promise<KnowledgeArticle[]> {
  const { data, error } = await withActiveOnly(
    supabase.from("knowledge_articles").select("*") as any,
    { flagColumn: "published" },
  ).order("created_at", { ascending: false });
  if (error) throw error;
  return (data as KnowledgeArticleRow[]).map(mapArticle);
}

export async function fetchPublicArticleBySlug(slug: string): Promise<KnowledgeArticle | null> {
  const { data, error } = await withActiveOnly(
    supabase.from("knowledge_articles").select("*").eq("slug", slug) as any,
    { flagColumn: "published" },
  ).maybeSingle();
  if (error) throw error;
  return data ? mapArticle(data as KnowledgeArticleRow) : null;
}

export async function fetchAdminArticles(): Promise<KnowledgeArticle[]> {
  const { data, error } = await withActiveOnly(
    supabase.from("knowledge_articles").select("*") as any,
  ).order("created_at", { ascending: false });
  if (error) throw error;
  return (data as KnowledgeArticleRow[]).map(mapArticle);
}

export interface ArticleInput {
  title: string;
  slug: string;
  bodyMarkdown: string;
  coverImageUrl: string | null;
  published: boolean;
}

export async function createArticle(input: ArticleInput): Promise<string> {
  const { data, error } = await supabase
    .from("knowledge_articles")
    .insert({
      title: input.title,
      slug: input.slug,
      body_markdown: input.bodyMarkdown,
      cover_image_url: input.coverImageUrl,
      published: input.published,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateArticle(id: string, input: ArticleInput): Promise<void> {
  const { error } = await supabase
    .from("knowledge_articles")
    .update({
      title: input.title,
      slug: input.slug,
      body_markdown: input.bodyMarkdown,
      cover_image_url: input.coverImageUrl,
      published: input.published,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function softDeleteArticle(id: string): Promise<void> {
  const { error } = await supabase
    .from("knowledge_articles")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}
