import { TestimonialStatus } from "../../prisma/generated/prisma/enums.js";
import type { TestimonialContract } from "../contracts/TestimonialContract.js";
import type { TestimonialData } from "../dtos/testimonial/TestimonialData.js";
import { prisma } from "../infra/prisma/index.js";
import type { PrismaTransactionClient } from "./index.js";
export type { TestimonialData } from "../dtos/testimonial/TestimonialData.js";

export class TestimonialRepository implements TestimonialContract {
  constructor(private readonly prismaClient: PrismaTransactionClient = prisma) {}

  listPublic() {
    return this.prismaClient.testimonial.findMany({
      where: { status: TestimonialStatus.APPROVED },
      orderBy: [{ approved_at: "desc" }, { created_at: "desc" }],
    });
  }

  listAdmin() {
    return this.prismaClient.testimonial.findMany({ orderBy: { created_at: "desc" } });
  }

  findById(input: { testimonial_id: string }) {
    return this.prismaClient.testimonial.findUnique({ where: { id: input.testimonial_id } });
  }

  create(data: TestimonialData) {
    return this.prismaClient.testimonial.create({ data });
  }

  updateStatus(input: { testimonial_id: string }, status: TestimonialStatus) {
    return this.prismaClient.testimonial.update({
      where: { id: input.testimonial_id },
      data: {
        status,
        approved_at: status === TestimonialStatus.APPROVED ? new Date() : null,
      },
    });
  }

  delete(input: { testimonial_id: string }) {
    return this.prismaClient.testimonial.delete({ where: { id: input.testimonial_id } });
  }
}
