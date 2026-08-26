import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchAdminArticles, softDeleteArticle } from "../api/knowledge.api";
import type { KnowledgeArticle } from "../types";

export default function AdminKnowledgeListPage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setArticles(await fetchAdminArticles());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Soft-delete this article?")) return;
    await softDeleteArticle(id);
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-canopy">Knowledge Articles</h1>
        <Button asChild>
          <Link to="/admin/knowledge/new">Add article</Link>
        </Button>
      </div>

      {loading ? (
        <p className="mt-6 text-center text-charcoal/60">Loading...</p>
      ) : articles.length === 0 ? (
        <p className="mt-6 text-charcoal/60">No articles yet. ANZ has not authored any Knowledge content.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-charcoal/70">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold">{a.title}</td>
                  <td className="px-4 py-3">
                    <Badge variant={a.published ? "status" : "muted"}>{a.published ? "Published" : "Draft"}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/knowledge/${a.id}`} className="mr-4 text-canopy underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(a.id)} className="text-destructive underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
