import { prisma } from "../infra/prisma/index.js";
import { PublicationStatus } from "../../prisma/generated/prisma/enums.js";

export type ProjectData = {
  thumbnail: string;
  title: string;
  slug: string;
  description: string;
  objective: string;
  challenge: string | null;
  status: PublicationStatus;
  published_at: Date | null;
  featured: boolean;
  sort_order: number;
};

export type ProjectImageData = {
  path: string;
  alt_text: string | null;
  sort_order: number;
};

const projectInclude = {
  images: {
    orderBy: { sort_order: "asc" as const },
  },
  stacks: {
    include: { stack: true },
    orderBy: { stack: { name: "asc" as const } },
  },
};

export class ProjectRepository {
  public project_id = "";
  public image_id = "";
  public slug = "";
  public data: ProjectData = {
    thumbnail: "",
    title: "",
    slug: "",
    description: "",
    objective: "",
    challenge: null,
    status: PublicationStatus.DRAFT,
    published_at: null,
    featured: false,
    sort_order: 0,
  };
  public stack_ids: string[] = [];
  public images: ProjectImageData[] = [];

  public async listPublished() {
    return prisma.project.findMany({
      where: { status: PublicationStatus.PUBLISHED },
      include: projectInclude,
      orderBy: [
        { featured: "desc" },
        { sort_order: "asc" },
        { published_at: "desc" },
      ],
    });
  }

  public async listAdmin() {
    return prisma.project.findMany({
      include: projectInclude,
      orderBy: [
        { sort_order: "asc" },
        { created_at: "desc" },
      ],
    });
  }

  public async findPublishedBySlug() {
    return prisma.project.findFirst({
      where: {
        slug: this.slug,
        status: PublicationStatus.PUBLISHED,
      },
      include: projectInclude,
    });
  }

  public async findById() {
    return prisma.project.findUnique({
      where: { id: this.project_id },
      include: projectInclude,
    });
  }

  public async findBySlug() {
    return prisma.project.findUnique({
      where: { slug: this.slug },
      select: { id: true },
    });
  }

  public async countStacks() {
    return prisma.stack.count({
      where: { id: { in: this.stack_ids } },
    });
  }

  public async create() {
    return prisma.project.create({
      data: {
        ...this.data,
        stacks: {
          create: this.stack_ids.map((stack_id) => ({
            stack: { connect: { id: stack_id } },
          })),
        },
        images: {
          create: this.images,
        },
      },
      include: projectInclude,
    });
  }

  public async update() {
    return prisma.$transaction(async (transaction) => {
      await transaction.projectStack.deleteMany({
        where: { project_id: this.project_id },
      });

      await transaction.project.update({
        where: { id: this.project_id },
        data: {
          ...this.data,
          stacks: {
            create: this.stack_ids.map((stack_id) => ({
              stack: { connect: { id: stack_id } },
            })),
          },
          images: {
            create: this.images,
          },
        },
      });

      return transaction.project.findUniqueOrThrow({
        where: { id: this.project_id },
        include: projectInclude,
      });
    });
  }

  public async delete() {
    return prisma.project.delete({
      where: { id: this.project_id },
    });
  }

  public async findImageById() {
    return prisma.projectImage.findFirst({
      where: {
        id: this.image_id,
        project_id: this.project_id,
      },
    });
  }

  public async deleteImage() {
    return prisma.projectImage.delete({
      where: { id: this.image_id },
    });
  }

  public async reorderImages(imageIds: string[]) {
    return prisma.$transaction(async (transaction) => {
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
        where: { project_id: this.project_id },
        orderBy: { sort_order: "asc" },
      });
    });
  }
}
