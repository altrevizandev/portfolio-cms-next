import type { HomepageContract } from "../contracts/HomepageContract.js";
import type { HomepageData } from "../dtos/homepage/HomepageData.js";
import { prisma } from "../infra/prisma/index.js";
import type { PrismaTransactionClient } from "./index.js";
export type { HomepageData } from "../dtos/homepage/HomepageData.js";

export class HomepageRepository implements HomepageContract {
  constructor(private readonly prismaClient: PrismaTransactionClient = prisma) {}

  public async findSingletonCandidates() {
    return this.prismaClient.homepage.findMany({
      orderBy: { id: "asc" },
      take: 2,
    });
  }

  public async upsert(input: { data: HomepageData }) {
    return this.prismaClient.homepage.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        ...input.data,
      },
      update: input.data,
    });
  }
}
