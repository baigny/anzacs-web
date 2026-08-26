import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEnquiryModal } from "@/components/enquiry/EnquiryModalProvider";
import { useSiteCopy } from "@/features/site-copy/public/useSiteCopy";
import { copy } from "@/features/site-copy/api/siteCopy.api";
import { fetchPublicProducts } from "@/features/products/api/products.api";
import { ProductCard } from "@/features/products/public/ProductCard";
import { TestimonialsSection } from "@/features/testimonials/public/TestimonialsSection";
import type { Product } from "@/features/products/types";
import { trackEvent } from "@/lib/trackEvent";
import { Leaf, Sprout, Award, MapPin, Wheat } from "lucide-react";

const PROCESS_STEPS = [
  { title: "Choose ANZ Agri", caption: "Pick the right seed variety for your soil and region." },
  { title: "Sow the seeds", caption: "Plant with confidence using our agronomy guidance." },
  { title: "Harvest Maximum", caption: "Get the most from every season with quality genetics." },
];

const INNOVATION_FEATURES = [
  { title: "Plant genetics R&D", body: "Over a decade of breeding experience behind every variety." },
  { title: "Region-tagged seed", body: "Recommendations mapped to South, Central, North & Pan India." },
  { title: "Hybrid & OP lines", body: "A catalog spanning both hybrid and open-pollinated seed." },
  { title: "Farmer-first support", body: "Guidance on sowing, care, and getting the best yield." },
];

export default function HomePage() {
  const { siteCopy } = useSiteCopy();
  const { open } = useEnquiryModal();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    trackEvent("page_view", { page: "home" });
    fetchPublicProducts().then((all) => setProducts(all.filter((p) => p.heroImageUrl).slice(0, 6)));
  }, []);

  const stats = [
    { icon: Sprout, label: copy(siteCopy, "stat_1_label", "30+"), caption: copy(siteCopy, "stat_1_caption", "Seed varieties") },
    { icon: Leaf, label: copy(siteCopy, "stat_2_label", "2009"), caption: copy(siteCopy, "stat_2_caption", "Founded") },
    { icon: Award, label: copy(siteCopy, "stat_3_label", "10+ yrs"), caption: copy(siteCopy, "stat_3_caption", "R&D experience") },
    { icon: MapPin, label: copy(siteCopy, "stat_4_label", "Pan India"), caption: copy(siteCopy, "stat_4_caption", "Coverage") },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-canopy-dark via-canopy to-canopy-light pb-24 pt-16 text-cream">
        <div className="container grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-cream/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-lime">
              {copy(siteCopy, "hero_eyebrow", "Trusted seeds since 2009")}
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              {copy(siteCopy, "hero_headline_line1", "Grow more with seeds")}
              <br />
              <span className="text-lime">{copy(siteCopy, "hero_headline_line2", "built for your soil")}</span>
            </h1>
            <p className="mt-5 max-w-lg text-cream/85">
              {copy(
                siteCopy,
                "hero_subhead",
                "ANZ Agri Crop Sciences breeds and supplies hybrid and open-pollinated vegetable seeds.",
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/products">{copy(siteCopy, "cta_primary_label", "Explore our seeds")}</Link>
              </Button>
              <Button variant="outline" size="lg" onClick={() => open()}>
                {copy(siteCopy, "cta_secondary_label", "Talk to an expert")}
              </Button>
            </div>
          </div>
          <div className="hidden md:block" aria-hidden="true">
            <div className="relative ml-auto flex h-80 w-full max-w-sm -rotate-2 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-lime via-lime-dark to-canopy-dark p-8 shadow-2xl">
              <Wheat className="h-28 w-28 text-cream/90" strokeWidth={1.25} />
              <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/95 p-5 text-charcoal shadow-lg">
                <p className="text-xs font-bold uppercase tracking-wide text-canopy/70">Featured crop</p>
                <p className="mt-1 font-bold text-canopy">Built for bold growth</p>
                <p className="mt-1 text-xs text-charcoal/60">Strong stand · Uniform crop · Field confidence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="container">
          <div className="relative z-10 -mb-32 mt-12 grid grid-cols-2 gap-6 rounded-lg bg-white p-8 text-charcoal shadow-lg md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <stat.icon className="h-6 w-6 text-canopy" aria-hidden="true" />
                <p className="mt-2 text-xl font-bold text-canopy">{stat.label}</p>
                <p className="mt-1 text-xs text-charcoal/60">{stat.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-24 md:h-16" />

      {/* 3-step process */}
      <section className="container py-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {PROCESS_STEPS.map((step, i) => (
            <div key={step.title} className="rounded-lg border border-border bg-white p-6">
              <span className="text-sm font-semibold text-gold-dark">Step {i + 1}</span>
              <h3 className="mt-1 text-xl font-bold text-canopy">{step.title}</h3>
              <p className="mt-2 text-sm text-charcoal/70">{step.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product highlights */}
      <section className="container py-14" aria-labelledby="products-heading">
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-dark">Our Seeds</p>
        <h2 id="products-heading" className="mt-2 text-3xl font-bold text-canopy">
          A catalog built for Indian farms
        </h2>
        <p className="mt-3 max-w-2xl text-charcoal/80">
          Hybrid and open-pollinated vegetable seed varieties, each with agronomy details to help you
          plan your season.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8">
          <Button asChild variant="outline-dark">
            <Link to="/products">See all products</Link>
          </Button>
        </div>
      </section>

      {/* Innovation & quality (dark split section) */}
      <section className="bg-canopy py-16 text-cream" aria-labelledby="innovation-heading">
        <div className="container grid gap-10 md:grid-cols-2">
          <div className="hidden rounded-lg bg-cream/5 md:block" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-lime">Innovation & quality</p>
            <h2 id="innovation-heading" className="mt-2 text-3xl font-bold">
              Genetics you can trust
            </h2>
            <p className="mt-3 text-cream/80">
              Every variety in our catalog is backed by structured agronomy data and years of field
              experience across South, Central, North, and Pan-India growing regions.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {INNOVATION_FEATURES.map((f) => (
                <div key={f.title}>
                  <h3 className="font-bold text-lime">{f.title}</h3>
                  <p className="mt-1 text-sm text-cream/75">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* Gold CTA banner */}
      <section className="container py-14">
        <div className="flex flex-col items-center gap-6 rounded-lg bg-gold px-8 py-12 text-center text-charcoal md:flex-row md:justify-between md:text-left">
          <h2 className="text-2xl font-bold md:text-3xl">
            {copy(siteCopy, "cta_banner_headline", "Ready to plan your next season?")}
          </h2>
          <Button size="lg" onClick={() => open()}>
            {copy(siteCopy, "cta_banner_button_label", "Get in touch")}
          </Button>
        </div>
      </section>
    </div>
  );
}
