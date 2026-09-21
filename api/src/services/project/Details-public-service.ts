import type { ProjectContract } from "../../contracts/ProjectContract.js";
import type { ProjectPublicDetailsDTO } from "../../dtos/project/ProjectPublicDetailsDTO.js";

import { ApiError } from "../../utils/ApiError.js";

export class ProjectPublicDetailsService {
  constructor(private readonly projectRepository: ProjectContract) {}

  public async execute(input: ProjectPublicDetailsDTO) {
    const project = await this.projectRepository.findPublishedBySlug({ slug: input.slug });

    if (!project) {
      throw new ApiError("Projeto nao encontrado", 404);
    }

    return project;
  }
}
