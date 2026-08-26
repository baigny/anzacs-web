import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createArticle, fetchAdminArticles, updateArticle, type ArticleInput } from "../api/knowledge.api";

export default function AdminKnowledgeFormPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState<ArticleInput>({
    title: "",
    slug: "",
    bodyMarkdown: "",
    coverImageUrl: "",
    published: false,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew || !id) return;
    fetchAdminArticles().then((all) => {
      const existing = all.find((a) => a.id === id);
      if (existing) {
        setForm({
          title: existing.title,
          slug: existing.slug,
          bodyMarkdown: existing.bodyMarkdown,
          coverImageUrl: existing.coverImageUrl ?? "",
          published: existing.published,
        });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.title.trim() || !form.slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await createArticle(form);
      } else if (id) {
        await updateArticle(id, form);
      }
      navigate("/admin/knowledge");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-center text-charcoal/60">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-canopy">{isNew ? "Add article" : "Edit article"}</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="a-title">Title</Label>
            <Input id="a-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="a-slug">Slug</Label>
            <Input id="a-slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="a-cover">Cover image URL</Label>
          <Input
            id="a-cover"
            value={form.coverImageUrl ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, coverImageUrl: e.target.value }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="a-body">Body (Markdown)</Label>
          <Textarea
            id="a-body"
            rows={12}
            value={form.bodyMarkdown}
            onChange={(e) => setForm((f) => ({ ...f, bodyMarkdown: e.target.value }))}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="a-published"
            checked={form.published}
            onCheckedChange={(v) => setForm((f) => ({ ...f, published: v === true }))}
          />
          <Label htmlFor="a-published" className="font-normal">Published (visible on public site)</Label>
        </div>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save article"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate("/admin/knowledge")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
