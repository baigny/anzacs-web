import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEnquiryModal } from "@/components/enquiry/EnquiryModalProvider";
import { trackEvent } from "@/lib/trackEvent";
import type { Product } from "../types";

export function ProductCard({ product }: { product: Product }) {
  const { open } = useEnquiryModal();

  function handleViewProduct() {
    trackEvent("product_card_click", { slug: product.slug, cropType: product.cropType });
    open({ cropInterest: product.cropType, productId: product.id });
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="aspect-[4/3] w-full bg-canopy/10">
        {product.heroImageUrl ? (
          <img
            src={product.heroImageUrl}
            alt={`${product.name} (${product.cropType})`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-sm text-canopy/50"
            role="img"
            aria-label={`${product.name} placeholder image`}
          >
            Photo coming soon
          </div>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col gap-2 pt-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-gold-dark">
          {product.cropType}
        </span>
        <h3 className="text-lg font-bold text-canopy">{product.name}</h3>

        {product.attributes.length > 0 && (
          <ul className="flex flex-col gap-1 text-sm text-charcoal/80">
            {product.attributes.slice(0, 4).map((attr) => (
              <li key={attr.id}>
                <span className="font-semibold">{attr.label}:</span> {attr.value}
              </li>
            ))}
          </ul>
        )}

        <Button type="button" size="sm" onClick={handleViewProduct} className="mt-auto self-start">
          Request Quote &rarr;
        </Button>
      </CardContent>
    </Card>
  );
}
