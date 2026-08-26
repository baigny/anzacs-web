import { Outlet } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { EnquiryModalProvider } from "@/components/enquiry/EnquiryModalProvider";

export function PublicLayout() {
  return (
    <EnquiryModalProvider>
      <div className="flex min-h-screen flex-col bg-cream">
        <Nav />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </EnquiryModalProvider>
  );
}
