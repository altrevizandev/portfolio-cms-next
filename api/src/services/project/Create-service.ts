import { ProjectRepository } from "../../repositories/Project-repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { buildProjectData, type ProjectInput } from "./Project-data.js";

export class ProjectCreateService {
  public data: ProjectInput = {
    title: "",
    description: "",
    objective: "",
    status: "DRAFT",
    featured: false,
    sort_order: 0,
    stack_ids: [],
  };

  private readonly projectRepository = new ProjectRepository();

  public async execute() {
    if (!this.data.thumbnail) {
      throw new ApiError("A thumbnail do projeto e obrigatoria", 400);
    }

    const projectData = buildProjectData(this.data, this.data.thumbnail);

    if (!projectData.slug) {
      throw new ApiError("Nao foi possivel gerar um slug valido", 400);
    }

    this.projectRepository.slug = projectData.slug;
    if (await this.projectRepository.findBySlug()) {
      throw new ApiError("Ja existe um projeto com este slug", 409);
    }

    const uniqueStackIds = [ ...new Set(this.data.stack_ids) ];
    this.projectRepository.stack_ids = uniqueStackIds;

    if (
      uniqueStackIds.length > 0 &&
      await this.projectRepository.countStacks() !== uniqueStackIds.length
    ) {
      throw new ApiError("Uma ou mais stacks informadas nao existem", 400);
    }

    this.projectRepository.data = projectData;
    this.projectRepository.images = this.data.images ?? [];

    return this.projectRepository.create();
  }
}
