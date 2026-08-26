import type { EnquiryStatus } from "@/lib/database.types";

export interface Enquiry {
  id: string;
  name: string;
  mobile: string;
  cropInterest: string | null;
  productId: string | null;
  message: string | null;
  consent: boolean;
  status: EnquiryStatus;
  createdAt: string;
}

export interface EnquiryFormValues {
  name: string;
  mobile: string;
  cropInterest: string;
  message: string;
  consent: boolean;
  productId?: string | null;
}
