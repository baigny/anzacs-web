import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="container flex min-h-[50vh] flex-col items-center justify-center py-14 text-center">
      <h1 className="text-3xl font-bold text-canopy">Page not found</h1>
      <p className="mt-2 text-charcoal/70">The page you're looking for doesn't exist.</p>
      <Button asChild className="mt-6">
        <Link to="/">Back home</Link>
      </Button>
    </div>
  );
}
