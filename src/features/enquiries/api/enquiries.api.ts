import { supabase } from "@/lib/supabase";
import type { EnquiryRow, EnquiryStatus } from "@/lib/database.types";
import type { Enquiry, EnquiryFormValues } from "../types";

function mapEnquiry(row: EnquiryRow): Enquiry {
  return {
    id: row.id,
    name: row.name,
    mobile: row.mobile,
    cropInterest: row.crop_interest,
    productId: row.product_id,
    message: row.message,
    consent: row.consent,
    status: row.status,
    createdAt: row.created_at,
  };
}

/** Public: insert-only. RLS forbids public SELECT entirely. */
export async function submitEnquiry(values: EnquiryFormValues): Promise<void> {
  const { error } = await supabase.from("enquiries").insert({
    name: values.name.trim(),
    mobile: values.mobile.trim(),
    crop_interest: values.cropInterest || null,
    product_id: values.productId ?? null,
    message: values.message || null,
    consent: values.consent,
    status: "new",
  });
  if (error) throw error;
}

/** Admin-only: RLS restricts this to authenticated admin roles. */
export async function fetchAdminEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as EnquiryRow[]).map(mapEnquiry);
}

/** Admin can update status only -- the submitted data itself is never editable. */
export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
  if (error) throw error;
}
