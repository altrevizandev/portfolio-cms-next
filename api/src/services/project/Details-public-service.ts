import { ProjectRepository } from "../../repositories/Project-repository.js";
import { ApiError } from "../../utils/ApiError.js";

export class ProjectPublicDetailsService {
  public slug = "";
  private readonly projectRepository = new ProjectRepository();

  public async execute() {
    this.projectRepository.slug = this.slug;
    const project = await this.projectRepository.findPublishedBySlug();

    if (!project) {
      throw new ApiError("Projeto nao encontrado", 404);
    }

    return project;
  }
}
