import type { ProjectContract } from "../../contracts/ProjectContract.js";
import type { ProjectReorderImagesDTO } from "../../dtos/project/ProjectReorderImagesDTO.js";

import { ApiError } from "../../utils/ApiError.js";

export class ProjectReorderImagesService {
  constructor(private readonly projectRepository: ProjectContract) {}

  public async execute(input: ProjectReorderImagesDTO) {
    const project = await this.projectRepository.findById({ project_id: input.project_id });

    if (!project) {
      throw new ApiError("Projeto nao encontrado", 404);
    }

    const uniqueIds = new Set(input.image_ids);
    const currentIds = new Set(project.images.map((image) => image.id));

    if (
      uniqueIds.size !== input.image_ids.length ||
      uniqueIds.size !== currentIds.size ||
      [...uniqueIds].some((id) => !currentIds.has(id))
    ) {
      throw new ApiError("Informe todas as imagens do projeto uma unica vez", 400);
    }

    return this.projectRepository.reorderImages({ project_id: input.project_id }, input.image_ids);
  }
}
