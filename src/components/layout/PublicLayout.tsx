import { Outlet } from "react-router-dom";
import { PublicNav } from "./PublicNav";
import { PublicFooter } from "./PublicFooter";
import { EnquiryModalProvider } from "@/components/enquiry/EnquiryModalProvider";

export function PublicLayout() {
  return (
    <EnquiryModalProvider>
      <div className="flex min-h-screen flex-col bg-cream">
        <PublicNav />
        <main className="flex-1">
          <Outlet />
        </main>
        <PublicFooter />
      </div>
    </EnquiryModalProvider>
  );
}
