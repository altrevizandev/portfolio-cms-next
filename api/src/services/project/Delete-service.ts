import { ProjectRepository } from "../../repositories/Project-repository.js";
import { ApiError } from "../../utils/ApiError.js";

export class ProjectDeleteService {
  public project_id = "";
  private readonly projectRepository = new ProjectRepository();

  public async execute() {
    this.projectRepository.project_id = this.project_id;
    const project = await this.projectRepository.findById();

    if (!project) {
      throw new ApiError("Projeto nao encontrado", 404);
    }

    await this.projectRepository.delete();

    return [
      project.thumbnail,
      ...project.images.map((image) => image.path),
    ];
  }
}
