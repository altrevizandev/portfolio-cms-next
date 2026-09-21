import type { ProjectContract } from "../../contracts/ProjectContract.js";
import type { ProjectAdminDetailsDTO } from "../../dtos/project/ProjectAdminDetailsDTO.js";

import { ApiError } from "../../utils/ApiError.js";

export class ProjectAdminDetailsService {
  constructor(private readonly projectRepository: ProjectContract) {}

  public async execute(input: ProjectAdminDetailsDTO) {
    const project = await this.projectRepository.findById({ project_id: input.project_id });

    if (!project) {
      throw new ApiError("Projeto nao encontrado", 404);
    }

    return project;
  }
}
