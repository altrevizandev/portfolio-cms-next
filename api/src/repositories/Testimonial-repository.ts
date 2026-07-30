import { TestimonialStatus } from "../../prisma/generated/prisma/enums.js";
import { prisma } from "../infra/prisma/index.js";

export type TestimonialData = {
  author_name: string;
  author_role: string | null;
  company: string | null;
  avatar: string | null;
  content: string;
};

export class TestimonialRepository {
  public testimonial_id = "";

  listPublic() {
    return prisma.testimonial.findMany({
      where: { status: TestimonialStatus.APPROVED },
      orderBy: [ { approved_at: "desc" }, { created_at: "desc" } ],
    });
  }

  listAdmin() {
    return prisma.testimonial.findMany({ orderBy: { created_at: "desc" } });
  }

  findById() {
    return prisma.testimonial.findUnique({ where: { id: this.testimonial_id } });
  }

  create(data: TestimonialData) {
    return prisma.testimonial.create({ data });
  }

  updateStatus(status: TestimonialStatus) {
    return prisma.testimonial.update({
      where: { id: this.testimonial_id },
      data: {
        status,
        approved_at: status === TestimonialStatus.APPROVED ? new Date() : null,
      },
    });
  }

  delete() {
    return prisma.testimonial.delete({ where: { id: this.testimonial_id } });
  }
}
