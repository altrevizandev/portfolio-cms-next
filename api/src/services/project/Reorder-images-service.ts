import { ProjectRepository } from "../../repositories/Project-repository.js";
import { ApiError } from "../../utils/ApiError.js";

export class ProjectReorderImagesService {
  public project_id = "";
  public image_ids: string[] = [];
  private readonly projectRepository = new ProjectRepository();

  public async execute() {
    this.projectRepository.project_id = this.project_id;
    const project = await this.projectRepository.findById();

    if (!project) {
      throw new ApiError("Projeto nao encontrado", 404);
    }

    const uniqueIds = new Set(this.image_ids);
    const currentIds = new Set(project.images.map((image) => image.id));

    if (
      uniqueIds.size !== this.image_ids.length ||
      uniqueIds.size !== currentIds.size ||
      [ ...uniqueIds ].some((id) => !currentIds.has(id))
    ) {
      throw new ApiError(
        "Informe todas as imagens do projeto uma unica vez",
        400,
      );
    }

    return this.projectRepository.reorderImages(this.image_ids);
  }
}
