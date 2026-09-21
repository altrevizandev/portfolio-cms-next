import type { ProjectContract } from "../../contracts/ProjectContract.js";
import type { ProjectCreateDTO } from "../../dtos/project/ProjectCreateDTO.js";

import { ApiError } from "../../utils/ApiError.js";
import { buildProjectData } from "./Project-data.js";

export class ProjectCreateService {
  constructor(private readonly projectRepository: ProjectContract) {}

  public async execute(input: ProjectCreateDTO) {
    if (!input.data.thumbnail) {
      throw new ApiError("A thumbnail do projeto e obrigatoria", 400);
    }

    const projectData = buildProjectData(input.data, input.data.thumbnail);

    if (!projectData.slug) {
      throw new ApiError("Nao foi possivel gerar um slug valido", 400);
    }

    if (await this.projectRepository.findBySlug({ slug: projectData.slug })) {
      throw new ApiError("Ja existe um projeto com este slug", 409);
    }

    const uniqueStackIds = [...new Set(input.data.stack_ids)];

    if (
      uniqueStackIds.length > 0 &&
      (await this.projectRepository.countStacks({ stack_ids: uniqueStackIds })) !==
        uniqueStackIds.length
    ) {
      throw new ApiError("Uma ou mais stacks informadas nao existem", 400);
    }

    return this.projectRepository.create({
      data: projectData,
      stack_ids: uniqueStackIds,
      images: input.data.images ?? [],
    });
  }
}
