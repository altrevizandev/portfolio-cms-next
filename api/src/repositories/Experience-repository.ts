import type { ExperienceContract } from "../contracts/ExperienceContract.js";
import type { ExperienceData } from "../dtos/experience/ExperienceData.js";
import { prisma } from "../infra/prisma/index.js";
import type { PrismaTransactionClient } from "./index.js";
export type { ExperienceData } from "../dtos/experience/ExperienceData.js";

export class ExperienceRepository implements ExperienceContract {
  constructor(private readonly prismaClient: PrismaTransactionClient = prisma) {}

  public listPublic() {
    return this.prismaClient.experience.findMany({
      where: { published: true },
      orderBy: [{ sort_order: "asc" }, { start_date: "desc" }],
    });
  }

  public listAdmin() {
    return this.prismaClient.experience.findMany({
      orderBy: [{ sort_order: "asc" }, { start_date: "desc" }],
    });
  }

  public findById(input: { experience_id: string }) {
    return this.prismaClient.experience.findUnique({ where: { id: input.experience_id } });
  }

  public create(input: { data: ExperienceData }) {
    return this.prismaClient.experience.create({ data: input.data });
  }

  public update(input: { experience_id: string; data: ExperienceData }) {
    return this.prismaClient.experience.update({
      where: { id: input.experience_id },
      data: input.data,
    });
  }

  public delete(input: { experience_id: string }) {
    return this.prismaClient.experience.delete({ where: { id: input.experience_id } });
  }
}
