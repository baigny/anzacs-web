import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  createTestimonial,
  fetchAdminTestimonials,
  softDeleteTestimonial,
  updateTestimonial,
  type TestimonialInput,
} from "../api/testimonials.api";
import type { Testimonial } from "../types";

const EMPTY_FORM: TestimonialInput = { name: "", quote: "", consent: false, photoUrl: "" };

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setTestimonials(await fetchAdminTestimonials());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(t: Testimonial) {
    setEditingId(t.id);
    setForm({ name: t.name, quote: t.quote, consent: t.consent, photoUrl: t.photoUrl ?? "" });
  }

  function startNew() {
    setEditingId("new");
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId === "new") {
        await createTestimonial(form);
      } else if (editingId) {
        await updateTestimonial(editingId, form);
      }
      setEditingId(null);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Soft-delete this testimonial?")) return;
    await softDeleteTestimonial(id);
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-canopy">Testimonials</h1>
        <Button onClick={startNew}>Add testimonial</Button>
      </div>

      {editingId && (
        <form onSubmit={handleSubmit} className="mt-6 max-w-xl rounded-lg border border-border bg-white p-6">
          <h2 className="mb-4 font-bold text-canopy">{editingId === "new" ? "New testimonial" : "Edit testimonial"}</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="t-name">Name</Label>
              <Input id="t-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="t-quote">Quote</Label>
              <Textarea id="t-quote" value={form.quote} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="t-photo">Photo URL</Label>
              <Input id="t-photo" value={form.photoUrl ?? ""} onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="t-consent" checked={form.consent} onCheckedChange={(v) => setForm((f) => ({ ...f, consent: v === true }))} />
              <Label htmlFor="t-consent" className="font-normal">
                Consent obtained (optional — only shown on the public site once checked)
              </Label>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
              <Button type="button" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <p className="mt-6 text-center text-charcoal/60">Loading...</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-lg border border-border bg-white p-4">
              <div className="flex items-start justify-between">
                <p className="font-semibold text-canopy">{t.name}</p>
                {t.consent && <Badge variant="status">Consent OK</Badge>}
              </div>
              <p className="mt-2 text-sm text-charcoal/80">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-3 flex gap-4 text-sm">
                <button className="text-canopy underline" onClick={() => startEdit(t)}>Edit</button>
                <button className="text-destructive underline" onClick={() => handleDelete(t.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
