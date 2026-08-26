import * as React from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { EnquiryModal } from "./EnquiryModal";

interface EnquiryModalContextValue {
  open: (prefill?: { cropInterest?: string; productId?: string }) => void;
}

const EnquiryModalContext = createContext<EnquiryModalContextValue | undefined>(undefined);

export function EnquiryModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefill, setPrefill] = useState<{ cropInterest?: string; productId?: string }>({});

  const open = useCallback((next?: { cropInterest?: string; productId?: string }) => {
    setPrefill(next ?? {});
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <EnquiryModalContext.Provider value={value}>
      {children}
      <EnquiryModal open={isOpen} onOpenChange={setIsOpen} prefill={prefill} />
    </EnquiryModalContext.Provider>
  );
}

export function useEnquiryModal() {
  const ctx = useContext(EnquiryModalContext);
  if (!ctx) throw new Error("useEnquiryModal must be used within EnquiryModalProvider");
  return ctx;
}
