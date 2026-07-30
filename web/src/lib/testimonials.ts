import { cookies } from "next/headers"
import type { Testimonial } from "@/types/testimonial"

export async function getPublicTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await fetch(`${process.env.API_INTERNAL_URL}/testimonials`, {
      cache: "no-store",
    })
    if (!response.ok) return []
    const data = await response.json() as { testimonials: Testimonial[] }
    return data.testimonials ?? []
  } catch {
    return []
  }
}

export async function getAdminTestimonials(): Promise<Testimonial[]> {
  try {
    const cookieStore = await cookies()
    const response = await fetch(
      `${process.env.API_INTERNAL_URL}/admin/testimonials`,
      { headers: { cookie: cookieStore.toString() }, cache: "no-store" },
    )
    if (!response.ok) return []
    const data = await response.json() as { testimonials: Testimonial[] }
    return data.testimonials ?? []
  } catch {
    return []
  }
}
