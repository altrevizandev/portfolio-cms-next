import type { RoleContract } from "../contracts/RoleContract.js";
import { prisma } from "../infra/prisma/index.js";
import type { PrismaTransactionClient } from "./index.js";

export enum RolesEnum {
  ADMIN = "admin",
}

export class RoleRepository implements RoleContract {
  constructor(private readonly prismaClient: PrismaTransactionClient = prisma) {}

  public async findBySlug(input: { slug: string }) {
    return await this.prismaClient.role.findFirst({
      where: {
        slug: input.slug,
      },
    });
  }

  public async list() {
    return await this.prismaClient.role.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }
}
