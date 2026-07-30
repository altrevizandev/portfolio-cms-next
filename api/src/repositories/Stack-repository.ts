import { prisma } from "../infra/prisma/index.js";
import type { PrismaTransactionClient } from "./index.js";

export type StackData = {
  name: string;
  slug: string;
  icon_slug: string | null;
  color: string | null;
  website: string | null;
};

export class StackRepository {
  public stack_id = "";
  public slug = "";
  public data: StackData = {
    name: "",
    slug: "",
    icon_slug: null,
    color: null,
    website: null,
  };

  constructor(
    private readonly prismaClient: PrismaTransactionClient = prisma,
  ) {}

  public async list() {
    return this.prismaClient.stack.findMany({
      orderBy: { name: "asc" },
    });
  }

  public async findById() {
    return this.prismaClient.stack.findUnique({
      where: { id: this.stack_id },
    });
  }

  public async findBySlug() {
    return this.prismaClient.stack.findUnique({
      where: { slug: this.slug },
    });
  }

  public async create() {
    return this.prismaClient.stack.create({
      data: this.data,
    });
  }

  public async update() {
    return this.prismaClient.stack.update({
      where: { id: this.stack_id },
      data: this.data,
    });
  }

  public async countProjects() {
    return this.prismaClient.projectStack.count({
      where: { stack_id: this.stack_id },
    });
  }

  public async delete() {
    return this.prismaClient.stack.delete({
      where: { id: this.stack_id },
    });
  }
}
