import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { fetchPublicArticles } from "../api/knowledge.api";
import type { KnowledgeArticle } from "../types";
import { trackEvent } from "@/lib/trackEvent";

export default function KnowledgePage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackEvent("page_view", { page: "knowledge" });
    fetchPublicArticles()
      .then(setArticles)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-dark">Knowledge</p>
      <h1 className="mt-2 text-3xl font-bold text-canopy md:text-4xl">Farming knowledge & guides</h1>
      <p className="mt-3 max-w-2xl text-charcoal/80">
        Practical guidance on sowing, crop care, and getting the most from your seed.
      </p>

      {loading && <p className="mt-8 text-charcoal/60">Loading articles...</p>}

      {!loading && articles.length === 0 && (
        <div className="mt-10 rounded-lg border border-dashed border-canopy/30 bg-white p-10 text-center text-charcoal/60">
          <p>No articles published yet. Check back soon.</p>
        </div>
      )}

      {!loading && articles.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/knowledge/${article.slug}`}
              onClick={() => trackEvent("knowledge_article_click", { slug: article.slug })}
            >
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                <div className="aspect-[16/9] w-full bg-canopy/10">
                  {article.coverImageUrl && (
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <CardContent className="pt-4">
                  <h2 className="text-lg font-bold text-canopy">{article.title}</h2>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
