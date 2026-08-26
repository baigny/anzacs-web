import { supabase } from "@/lib/supabase";
import { withActiveOnly } from "@/lib/withActiveOnly";
import type { TestimonialRow } from "@/lib/database.types";
import type { Testimonial } from "../types";

function mapTestimonial(row: TestimonialRow): Testimonial {
  return { id: row.id, name: row.name, quote: row.quote, consent: row.consent, photoUrl: row.photo_url };
}

/** Public: only consent=true testimonials are ever shown. */
export async function fetchPublicTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await withActiveOnly(
    supabase.from("testimonials").select("*") as any,
    { flagColumn: "consent" },
  ).order("created_at", { ascending: false });
  if (error) throw error;
  return (data as TestimonialRow[]).map(mapTestimonial);
}

export async function fetchAdminTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await withActiveOnly(
    supabase.from("testimonials").select("*") as any,
  ).order("created_at", { ascending: false });
  if (error) throw error;
  return (data as TestimonialRow[]).map(mapTestimonial);
}

export interface TestimonialInput {
  name: string;
  quote: string;
  consent: boolean;
  photoUrl: string | null;
}

export async function createTestimonial(input: TestimonialInput): Promise<string> {
  const { data, error } = await supabase
    .from("testimonials")
    .insert({ name: input.name, quote: input.quote, consent: input.consent, photo_url: input.photoUrl })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateTestimonial(id: string, input: TestimonialInput): Promise<void> {
  const { error } = await supabase
    .from("testimonials")
    .update({ name: input.name, quote: input.quote, consent: input.consent, photo_url: input.photoUrl })
    .eq("id", id);
  if (error) throw error;
}

export async function softDeleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase
    .from("testimonials")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}
