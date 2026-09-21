import type { EducationContract } from "../contracts/EducationContract.js";
import type { EducationData } from "../dtos/education/EducationData.js";
import { prisma } from "../infra/prisma/index.js";
import type { PrismaTransactionClient } from "./index.js";
export type { EducationData } from "../dtos/education/EducationData.js";

export class EducationRepository implements EducationContract {
  constructor(private readonly prismaClient: PrismaTransactionClient = prisma) {}

  public listPublic() {
    return this.prismaClient.education.findMany({
      where: { published: true },
      orderBy: [{ sort_order: "asc" }, { start_date: "desc" }],
    });
  }

  public listAdmin() {
    return this.prismaClient.education.findMany({
      orderBy: [{ sort_order: "asc" }, { start_date: "desc" }],
    });
  }

  public findById(input: { education_id: string }) {
    return this.prismaClient.education.findUnique({ where: { id: input.education_id } });
  }

  public create(input: { data: EducationData }) {
    return this.prismaClient.education.create({ data: input.data });
  }

  public update(input: { education_id: string; data: EducationData }) {
    return this.prismaClient.education.update({
      where: { id: input.education_id },
      data: input.data,
    });
  }

  public delete(input: { education_id: string }) {
    return this.prismaClient.education.delete({ where: { id: input.education_id } });
  }
}
