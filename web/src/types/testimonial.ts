export type TestimonialStatus = "PENDING" | "APPROVED" | "REJECTED"

export type Testimonial = {
  id: string
  author_name: string
  author_role: string | null
  company: string | null
  avatar: string | null
  content: string
  status: TestimonialStatus
  approved_at: string | null
  created_at: string
  updated_at: string
}
