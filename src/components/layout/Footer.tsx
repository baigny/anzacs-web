import { Link } from "react-router-dom";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-canopy text-cream">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="inline-block rounded-lg bg-cream p-2">
            <img src="/anzacs-web/logo.png" alt="ANZ Agri Crop Sciences" className="h-9 w-auto" />
          </div>
          <p className="mt-3 text-sm text-cream/70">
            Quality hybrid and open-pollinated seeds, backed by plant genetics R&D since 2009.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-lime">Helpful</h2>
          <ul className="flex flex-col gap-2 text-sm text-cream/80">
            <li><Link to="/about" className="hover:text-lime">About us</Link></li>
            <li><Link to="/knowledge" className="hover:text-lime">Knowledge</Link></li>
            <li><Link to="/contact" className="hover:text-lime">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-lime">Our Products</h2>
          <ul className="flex flex-col gap-2 text-sm text-cream/80">
            <li><Link to="/products?section=hybrid" className="hover:text-lime">Hybrid seeds</Link></li>
            <li><Link to="/products?section=open_pollinated" className="hover:text-lime">Open pollinated seeds</Link></li>
          </ul>
        </div>

        <div>
          <Link to="/contact" className="text-sm font-semibold uppercase tracking-wide text-lime hover:underline">
            Contact Us
          </Link>
        </div>
      </div>

      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/60">
        &copy; {year} ANZ Agri Crop Sciences. All rights reserved.
      </div>
    </footer>
  );
}
