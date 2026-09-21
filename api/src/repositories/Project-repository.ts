import { PublicationStatus } from "../../prisma/generated/prisma/enums.js";
import type { ProjectContract } from "../contracts/ProjectContract.js";
import type { ProjectData, ProjectImageData } from "../dtos/project/ProjectData.js";
import { prisma } from "../infra/prisma/index.js";
export type { ProjectData, ProjectImageData } from "../dtos/project/ProjectData.js";

const projectInclude = {
  images: {
    orderBy: { sort_order: "asc" as const },
  },
  stacks: {
    include: { stack: true },
    orderBy: { stack: { name: "asc" as const } },
  },
};

export class ProjectRepository implements ProjectContract {
  constructor(private readonly prismaClient: typeof prisma = prisma) {}

  public async listPublished() {
    return this.prismaClient.project.findMany({
      where: { status: PublicationStatus.PUBLISHED },
      include: projectInclude,
      orderBy: [{ featured: "desc" }, { sort_order: "asc" }, { published_at: "desc" }],
    });
  }

  public async listAdmin() {
    return this.prismaClient.project.findMany({
      include: projectInclude,
      orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
    });
  }

  public async findPublishedBySlug(input: { slug: string }) {
    return this.prismaClient.project.findFirst({
      where: {
        slug: input.slug,
        status: PublicationStatus.PUBLISHED,
      },
      include: projectInclude,
    });
  }

  public async findById(input: { project_id: string }) {
    return this.prismaClient.project.findUnique({
      where: { id: input.project_id },
      include: projectInclude,
    });
  }

  public async findBySlug(input: { slug: string }) {
    return this.prismaClient.project.findUnique({
      where: { slug: input.slug },
      select: { id: true },
    });
  }

  public async countStacks(input: { stack_ids: string[] }) {
    return this.prismaClient.stack.count({
      where: { id: { in: input.stack_ids } },
    });
  }

  public async create(input: {
    data: ProjectData;
    stack_ids: string[];
    images: ProjectImageData[];
  }) {
    return this.prismaClient.project.create({
      data: {
        ...input.data,
        stacks: {
          create: input.stack_ids.map((stack_id) => ({
            stack: { connect: { id: stack_id } },
          })),
        },
        images: {
          create: input.images,
        },
      },
      include: projectInclude,
    });
  }

  public async update(input: {
    project_id: string;
    data: ProjectData;
    stack_ids: string[];
    images: ProjectImageData[];
  }) {
    return this.prismaClient.$transaction(async (transaction) => {
      await transaction.projectStack.deleteMany({
        where: { project_id: input.project_id },
      });

      await transaction.project.update({
        where: { id: input.project_id },
        data: {
          ...input.data,
          stacks: {
            create: input.stack_ids.map((stack_id) => ({
              stack: { connect: { id: stack_id } },
            })),
          },
          images: {
            create: input.images,
          },
        },
      });

      return transaction.project.findUniqueOrThrow({
        where: { id: input.project_id },
        include: projectInclude,
      });
    });
  }

  public async delete(input: { project_id: string }) {
    return this.prismaClient.project.delete({
      where: { id: input.project_id },
    });
  }

  public async findImageById(input: { image_id: string; project_id: string }) {
    return this.prismaClient.projectImage.findFirst({
      where: {
        id: input.image_id,
        project_id: input.project_id,
      },
    });
  }

  public async deleteImage(input: { image_id: string }) {
    return this.prismaClient.projectImage.delete({
      where: { id: input.image_id },
    });
  }

  public async reorderImages(input: { project_id: string }, imageIds: string[]) {
    return this.prismaClient.$transaction(async (transaction) => {
      await Promise.all(
        imageIds.map((id) =>
          transaction.projectImage.update({
            where: { id },
            data: { sort_order: { increment: 100_000 } },
          }),
        ),
      );

      await Promise.all(
        imageIds.map((id, sort_order) =>
          transaction.projectImage.update({
            where: { id },
            data: { sort_order },
          }),
        ),
      );

      return transaction.projectImage.findMany({
        where: { project_id: input.project_id },
        orderBy: { sort_order: "asc" },
      });
    });
  }
}
