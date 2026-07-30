import { prisma } from "../infra/prisma/index.js";

export type EducationData = {
  institution: string;
  course: string;
  degree: string | null;
  description: string | null;
  start_date: Date;
  end_date: Date | null;
  current: boolean;
  sort_order: number;
  published: boolean;
};

export class EducationRepository {
  public education_id = "";
  public data: EducationData = {
    institution: "",
    course: "",
    degree: null,
    description: null,
    start_date: new Date(),
    end_date: null,
    current: false,
    sort_order: 0,
    published: true,
  };

  public listPublic() {
    return prisma.education.findMany({
      where: { published: true },
      orderBy: [ { sort_order: "asc" }, { start_date: "desc" } ],
    });
  }

  public listAdmin() {
    return prisma.education.findMany({
      orderBy: [ { sort_order: "asc" }, { start_date: "desc" } ],
    });
  }

  public findById() {
    return prisma.education.findUnique({ where: { id: this.education_id } });
  }

  public create() {
    return prisma.education.create({ data: this.data });
  }

  public update() {
    return prisma.education.update({
      where: { id: this.education_id },
      data: this.data,
    });
  }

  public delete() {
    return prisma.education.delete({ where: { id: this.education_id } });
  }
}
