import { useEffect, useState } from "react";
import { fetchPublicTestimonials } from "../api/testimonials.api";
import type { Testimonial } from "../types";

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchPublicTestimonials().then(setTestimonials);
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="container py-14" aria-labelledby="testimonials-heading">
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-dark">What farmers say</p>
      <h2 id="testimonials-heading" className="mt-2 text-3xl font-bold text-canopy">
        Trusted by growers
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <blockquote key={t.id} className="rounded-lg border border-border bg-white p-6">
            <p className="text-charcoal/90">&ldquo;{t.quote}&rdquo;</p>
            <footer className="mt-4 text-sm font-semibold text-canopy">{t.name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
