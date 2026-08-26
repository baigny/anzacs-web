import { useEffect } from "react";
import { useSiteCopy } from "@/features/site-copy/public/useSiteCopy";
import { copy } from "@/features/site-copy/api/siteCopy.api";
import { trackEvent } from "@/lib/trackEvent";

export default function AboutPage() {
  const { siteCopy } = useSiteCopy();

  useEffect(() => {
    trackEvent("page_view", { page: "about" });
  }, []);

  return (
    <div className="container max-w-3xl py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-dark">About Us</p>
      <h1 className="mt-2 text-3xl font-bold text-canopy md:text-4xl">Who we are</h1>

      <p className="mt-6 whitespace-pre-line text-charcoal/85">
        {copy(
          siteCopy,
          "about_who_we_are_body",
          "ANZ Agri Crop Sciences was established in 2009 and is engaged in the agri seeds business, farming, and beekeeping.",
        )}
      </p>

      <div className="mt-10 rounded-lg border border-gold/40 bg-gold/10 p-6">
        <h2 className="text-xl font-bold text-canopy">A brand new look</h2>
        <p className="mt-2 whitespace-pre-line text-charcoal/85">
          {copy(
            siteCopy,
            "rebrand_story_body",
            "The seed you know and trust now has a brand new look!",
          )}
        </p>
      </div>
    </div>
  );
}
