import {
  ExperienceRepository,
  type ExperienceData,
} from "../../repositories/Experience-repository.js";
import { ApiError } from "../../utils/ApiError.js";

export type ExperienceInput = Omit<ExperienceData, "start_date" | "end_date"> & {
  start_date: string;
  end_date?: string | null;
};

function normalize(data: ExperienceInput): ExperienceData {
  const startDate = new Date(data.start_date);
  const endDate = data.current || !data.end_date ? null : new Date(data.end_date);

  if (endDate && endDate < startDate) {
    throw new ApiError("A data final nao pode ser anterior a data inicial", 400);
  }

  return {
    company: data.company.trim(),
    role: data.role.trim(),
    description: data.description.trim(),
    start_date: startDate,
    end_date: endDate,
    current: data.current,
    sort_order: data.sort_order,
    published: data.published,
  };
}

export class ExperiencePublicListService {
  private readonly repository = new ExperienceRepository();
  execute() { return this.repository.listPublic(); }
}

export class ExperienceAdminListService {
  private readonly repository = new ExperienceRepository();
  execute() { return this.repository.listAdmin(); }
}

export class ExperienceCreateService {
  public data!: ExperienceInput;
  private readonly repository = new ExperienceRepository();
  execute() {
    this.repository.data = normalize(this.data);
    return this.repository.create();
  }
}

export class ExperienceUpdateService {
  public experience_id = "";
  public data!: ExperienceInput;
  private readonly repository = new ExperienceRepository();

  async execute() {
    this.repository.experience_id = this.experience_id;
    if (!(await this.repository.findById())) {
      throw new ApiError("Experiencia nao encontrada", 404);
    }
    this.repository.data = normalize(this.data);
    return this.repository.update();
  }
}

export class ExperienceDeleteService {
  public experience_id = "";
  private readonly repository = new ExperienceRepository();

  async execute() {
    this.repository.experience_id = this.experience_id;
    if (!(await this.repository.findById())) {
      throw new ApiError("Experiencia nao encontrada", 404);
    }
    await this.repository.delete();
  }
}
