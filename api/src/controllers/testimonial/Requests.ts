import type { TestimonialStatus } from "../../../prisma/generated/prisma/enums.js";

export type TestimonialMutationRequest = {
  Params: { testimonial_id: string };
  Body: { status: TestimonialStatus };
};
