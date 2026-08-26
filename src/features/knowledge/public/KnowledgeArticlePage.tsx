import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { fetchPublicArticleBySlug } from "../api/knowledge.api";
import type { KnowledgeArticle } from "../types";

export default function KnowledgeArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<KnowledgeArticle | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    fetchPublicArticleBySlug(slug).then(setArticle);
  }, [slug]);

  if (article === undefined) {
    return <div className="container py-14 text-center text-charcoal/60">Loading...</div>;
  }

  if (article === null) {
    return (
      <div className="container py-14">
        <h1 className="text-2xl font-bold text-canopy">Article not found</h1>
        <Link to="/knowledge" className="mt-4 inline-block text-canopy underline">
          Back to Knowledge
        </Link>
      </div>
    );
  }

  return (
    <article className="container max-w-3xl py-14">
      <Link to="/knowledge" className="text-sm text-canopy underline">
        &larr; Back to Knowledge
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-canopy">{article.title}</h1>
      {article.coverImageUrl && (
        <img
          src={article.coverImageUrl}
          alt={article.title}
          className="mt-6 aspect-[16/9] w-full rounded-lg object-cover"
        />
      )}
      <div className="prose prose-headings:text-canopy mt-8 max-w-none">
        <ReactMarkdown>{article.bodyMarkdown}</ReactMarkdown>
      </div>
    </article>
  );
}
