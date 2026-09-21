import { TestimonialStatus } from "../../../prisma/generated/prisma/enums.js";

export type TestimonialInput = {
  author_name: string;
  author_role?: string | null;
  company?: string | null;
  avatar?: string | null;
  content: string;
  recaptcha_token: string;
};

export type TestimonialCreateDTO = { data: TestimonialInput };

export type TestimonialStatusDTO = { testimonial_id: string; status: TestimonialStatus };

export type TestimonialDeleteDTO = { testimonial_id: string };
