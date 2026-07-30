import { prisma } from "../infra/prisma/index.js";
import type { PrismaTransactionClient } from "./index.js";

export type HomepageData = {
  headline: string;
  subheadline: string | null;
  biography: string;
  primary_photo: string | null;
  secondary_photo: string | null;
  email: string | null;
  github_url: string | null;
  linkedin_url: string | null;
};

export class HomepageRepository {
  public homepage_id = 1;
  public data: HomepageData = {
    headline: "",
    subheadline: null,
    biography: "",
    primary_photo: null,
    secondary_photo: null,
    email: null,
    github_url: null,
    linkedin_url: null,
  };

  constructor(
    private readonly prismaClient: PrismaTransactionClient = prisma,
  ) {}

  public async findSingletonCandidates() {
    return this.prismaClient.homepage.findMany({
      orderBy: { id: "asc" },
      take: 2,
    });
  }

  public async upsert() {
    return this.prismaClient.homepage.upsert({
      where: { id: this.homepage_id },
      create: {
        id: this.homepage_id,
        ...this.data,
      },
      update: this.data,
    });
  }
}
