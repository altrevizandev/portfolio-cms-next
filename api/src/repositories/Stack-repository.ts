import type { StackContract } from "../contracts/StackContract.js";
import type { StackData } from "../dtos/stack/StackData.js";
import { prisma } from "../infra/prisma/index.js";
import type { PrismaTransactionClient } from "./index.js";
export type { StackData } from "../dtos/stack/StackData.js";

export class StackRepository implements StackContract {
  constructor(private readonly prismaClient: PrismaTransactionClient = prisma) {}

  public async list() {
    return this.prismaClient.stack.findMany({
      orderBy: { name: "asc" },
    });
  }

  public async findById(input: { stack_id: string }) {
    return this.prismaClient.stack.findUnique({
      where: { id: input.stack_id },
    });
  }

  public async findBySlug(input: { slug: string }) {
    return this.prismaClient.stack.findUnique({
      where: { slug: input.slug },
    });
  }

  public async create(input: { data: StackData }) {
    return this.prismaClient.stack.create({
      data: input.data,
    });
  }

  public async update(input: { stack_id: string; data: StackData }) {
    return this.prismaClient.stack.update({
      where: { id: input.stack_id },
      data: input.data,
    });
  }

  public async countProjects(input: { stack_id: string }) {
    return this.prismaClient.projectStack.count({
      where: { stack_id: input.stack_id },
    });
  }

  public async delete(input: { stack_id: string }) {
    return this.prismaClient.stack.delete({
      where: { id: input.stack_id },
    });
  }
}
