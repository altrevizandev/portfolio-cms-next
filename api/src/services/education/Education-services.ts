import {
  EducationRepository,
  type EducationData,
} from "../../repositories/Education-repository.js";
import { ApiError } from "../../utils/ApiError.js";

export type EducationInput = Omit<EducationData, "start_date" | "end_date"> & {
  start_date: string;
  end_date?: string | null;
};

function normalize(data: EducationInput): EducationData {
  const startDate = new Date(data.start_date);
  const endDate = data.current || !data.end_date ? null : new Date(data.end_date);

  if (endDate && endDate < startDate) {
    throw new ApiError("A data final nao pode ser anterior a data inicial", 400);
  }

  return {
    institution: data.institution.trim(),
    course: data.course.trim(),
    degree: data.degree?.trim() || null,
    description: data.description?.trim() || null,
    start_date: startDate,
    end_date: endDate,
    current: data.current,
    sort_order: data.sort_order,
    published: data.published,
  };
}

export class EducationPublicListService {
  private readonly repository = new EducationRepository();
  execute() { return this.repository.listPublic(); }
}

export class EducationAdminListService {
  private readonly repository = new EducationRepository();
  execute() { return this.repository.listAdmin(); }
}

export class EducationCreateService {
  public data!: EducationInput;
  private readonly repository = new EducationRepository();
  execute() {
    this.repository.data = normalize(this.data);
    return this.repository.create();
  }
}

export class EducationUpdateService {
  public education_id = "";
  public data!: EducationInput;
  private readonly repository = new EducationRepository();

  async execute() {
    this.repository.education_id = this.education_id;
    if (!(await this.repository.findById())) {
      throw new ApiError("Formacao nao encontrada", 404);
    }
    this.repository.data = normalize(this.data);
    return this.repository.update();
  }
}

export class EducationDeleteService {
  public education_id = "";
  private readonly repository = new EducationRepository();

  async execute() {
    this.repository.education_id = this.education_id;
    if (!(await this.repository.findById())) {
      throw new ApiError("Formacao nao encontrada", 404);
    }
    await this.repository.delete();
  }
}
