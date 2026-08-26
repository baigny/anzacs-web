import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAdminEnquiries, updateEnquiryStatus } from "../api/enquiries.api";
import type { Enquiry } from "../types";
import type { EnquiryStatus } from "@/lib/database.types";

const STATUS_VARIANT: Record<EnquiryStatus, "status" | "outline" | "muted"> = {
  new: "status",
  contacted: "outline",
  closed: "muted",
};

const STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setEnquiries(await fetchAdminEnquiries());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatusChange(id: string, status: EnquiryStatus) {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    await updateEnquiryStatus(id, status);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-canopy">Enquiries</h1>
      <p className="mt-1 text-charcoal/70">
        Submitted data is read-only. You can update the status as you follow up.
      </p>

      {loading ? (
        <p className="mt-6 text-center text-charcoal/60">Loading...</p>
      ) : enquiries.length === 0 ? (
        <p className="mt-6 text-charcoal/60">No enquiries yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-charcoal/70">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Crop interest</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e.id} className="border-t border-border align-top">
                  <td className="px-4 py-3 font-semibold">{e.name}</td>
                  <td className="px-4 py-3">{e.mobile}</td>
                  <td className="px-4 py-3">{e.cropInterest ?? "-"}</td>
                  <td className="px-4 py-3 max-w-xs">{e.message ?? "-"}</td>
                  <td className="px-4 py-3">{new Date(e.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={STATUS_VARIANT[e.status]}>{STATUS_LABELS[e.status]}</Badge>
                      <Select value={e.status} onValueChange={(v) => handleStatusChange(e.id, v as EnquiryStatus)}>
                        <SelectTrigger className="h-8 w-32 text-xs" aria-label={`Update status for ${e.name}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
