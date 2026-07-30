import { prisma } from "../infra/prisma/index.js";

export type ExperienceData = {
  company: string;
  role: string;
  description: string;
  start_date: Date;
  end_date: Date | null;
  current: boolean;
  sort_order: number;
  published: boolean;
};

export class ExperienceRepository {
  public experience_id = "";
  public data: ExperienceData = {
    company: "",
    role: "",
    description: "",
    start_date: new Date(),
    end_date: null,
    current: false,
    sort_order: 0,
    published: true,
  };

  public listPublic() {
    return prisma.experience.findMany({
      where: { published: true },
      orderBy: [ { sort_order: "asc" }, { start_date: "desc" } ],
    });
  }

  public listAdmin() {
    return prisma.experience.findMany({
      orderBy: [ { sort_order: "asc" }, { start_date: "desc" } ],
    });
  }

  public findById() {
    return prisma.experience.findUnique({ where: { id: this.experience_id } });
  }

  public create() {
    return prisma.experience.create({ data: this.data });
  }

  public update() {
    return prisma.experience.update({
      where: { id: this.experience_id },
      data: this.data,
    });
  }

  public delete() {
    return prisma.experience.delete({ where: { id: this.experience_id } });
  }
}
