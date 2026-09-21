import type { Testimonial } from "../../prisma/generated/prisma/client.js";
import type { TestimonialStatus } from "../../prisma/generated/prisma/enums.js";
import type { TestimonialData } from "../dtos/testimonial/TestimonialData.js";

export interface TestimonialContract {
  listPublic(): Promise<Testimonial[]>;
  listAdmin(): Promise<Testimonial[]>;
  findById(input: { testimonial_id: string }): Promise<Testimonial | null>;
  create(data: TestimonialData): Promise<Testimonial>;
  updateStatus(input: { testimonial_id: string }, status: TestimonialStatus): Promise<Testimonial>;
  delete(input: { testimonial_id: string }): Promise<Testimonial>;
}
