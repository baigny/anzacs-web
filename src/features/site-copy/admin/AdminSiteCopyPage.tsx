import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchSiteCopy, upsertSiteCopy, type SiteCopyMap } from "../api/siteCopy.api";

const KNOWN_KEYS = [
  "hero_eyebrow",
  "hero_headline_line1",
  "hero_headline_line2",
  "hero_subhead",
  "cta_primary_label",
  "cta_secondary_label",
  "stat_1_label",
  "stat_1_caption",
  "stat_2_label",
  "stat_2_caption",
  "stat_3_label",
  "stat_3_caption",
  "stat_4_label",
  "stat_4_caption",
  "cta_banner_headline",
  "cta_banner_button_label",
  "about_who_we_are_body",
  "rebrand_story_body",
];

function humanizeKey(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function AdminSiteCopyPage() {
  const [values, setValues] = useState<SiteCopyMap>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchSiteCopy().then((map) => {
      setValues(map);
      setLoading(false);
    });
  }, []);

  async function handleSave(key: string) {
    setSavingKey(key);
    try {
      await upsertSiteCopy(key, values[key] ?? "");
    } finally {
      setSavingKey(null);
    }
  }

  if (loading) return <p className="text-center text-charcoal/60">Loading...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-canopy">Site Copy</h1>
      <p className="mt-1 text-charcoal/70">
        Edit text blocks rendered live on the public site -- no code changes needed.
      </p>

      <div className="mt-6 flex flex-col gap-6">
        {KNOWN_KEYS.map((key) => (
          <div key={key} className="rounded-lg border border-border bg-white p-4">
            <Label htmlFor={`copy-${key}`}>{humanizeKey(key)}</Label>
            <Textarea
              id={`copy-${key}`}
              className="mt-2"
              value={values[key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            />
            <Button size="sm" className="mt-2" onClick={() => handleSave(key)} disabled={savingKey === key}>
              {savingKey === key ? "Saving..." : "Save"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
