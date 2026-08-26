import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEnquiryModal } from "@/components/enquiry/EnquiryModalProvider";

const LINKS = [
  { to: "/products", label: "Products" },
  { to: "/knowledge", label: "Knowledge" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Nav() {
  const { open } = useEnquiryModal();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? "text-canopy" : "text-charcoal/70 hover:text-canopy"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-canopy/10 bg-cream/95 backdrop-blur">
      <nav className="container flex h-16 items-center justify-between" aria-label="Primary">
        <NavLink to="/" className="flex items-center gap-2 font-bold text-canopy text-lg">
          <img src="/anzacs-web/logo.png" alt="ANZ Agri Crop Sciences" className="h-9 w-auto" />
        </NavLink>

        <div className="ml-auto hidden items-center gap-6 lg:flex">
          <ul className="flex items-center gap-6">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={linkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Button size="sm" onClick={() => open()}>
            Find the right seed
          </Button>
        </div>

        <button
          type="button"
          className="ml-auto rounded-lg p-2 text-canopy hover:bg-canopy/10 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-nav-menu" className="border-t border-canopy/10 bg-cream lg:hidden">
          <ul className="container flex flex-col gap-4 py-4">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={linkClass} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Button
                size="sm"
                onClick={() => {
                  setMenuOpen(false);
                  open();
                }}
              >
                Find the right seed
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
