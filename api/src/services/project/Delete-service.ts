import type { ProjectContract } from "../../contracts/ProjectContract.js";
import type { ProjectDeleteDTO } from "../../dtos/project/ProjectDeleteDTO.js";

import { ApiError } from "../../utils/ApiError.js";

export class ProjectDeleteService {
  constructor(private readonly projectRepository: ProjectContract) {}

  public async execute(input: ProjectDeleteDTO) {
    const project = await this.projectRepository.findById({ project_id: input.project_id });

    if (!project) {
      throw new ApiError("Projeto nao encontrado", 404);
    }

    await this.projectRepository.delete({ project_id: input.project_id });

    return [project.thumbnail, ...project.images.map((image) => image.path)];
  }
}
