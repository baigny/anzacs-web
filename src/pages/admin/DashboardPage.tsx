import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface Counts {
  products: number;
  articles: number;
  testimonials: number;
  newEnquiries: number;
}

export default function DashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    async function load() {
      const [products, articles, testimonials, newEnquiries] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).is("deleted_at", null),
        supabase.from("knowledge_articles").select("id", { count: "exact", head: true }).is("deleted_at", null),
        supabase.from("testimonials").select("id", { count: "exact", head: true }).is("deleted_at", null),
        supabase
          .from("enquiries")
          .select("id", { count: "exact", head: true })
          .is("deleted_at", null)
          .eq("status", "new"),
      ]);
      setCounts({
        products: products.count ?? 0,
        articles: articles.count ?? 0,
        testimonials: testimonials.count ?? 0,
        newEnquiries: newEnquiries.count ?? 0,
      });
    }
    load();
  }, []);

  const tiles = [
    { label: "Products", value: counts?.products, to: "/admin/products" },
    { label: "Knowledge Articles", value: counts?.articles, to: "/admin/knowledge" },
    { label: "Testimonials", value: counts?.testimonials, to: "/admin/testimonials" },
    { label: "New Enquiries", value: counts?.newEnquiries, to: "/admin/enquiries" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-canopy">Dashboard</h1>
      <p className="mt-1 text-charcoal/70">Overview of your site content.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link key={tile.label} to={tile.to}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-sm text-charcoal/60">{tile.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-canopy">{tile.value ?? "..."}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
