export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  bodyMarkdown: string;
  coverImageUrl: string | null;
  published: boolean;
}
