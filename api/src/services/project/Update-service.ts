import type { ProjectContract } from "../../contracts/ProjectContract.js";
import type { ProjectUpdateDTO } from "../../dtos/project/ProjectUpdateDTO.js";

import { ApiError } from "../../utils/ApiError.js";
import { buildProjectData } from "./Project-data.js";

export class ProjectUpdateService {
  constructor(private readonly projectRepository: ProjectContract) {}

  public async execute(input: ProjectUpdateDTO) {
    const currentProject = await this.projectRepository.findById({ project_id: input.project_id });

    if (!currentProject) {
      throw new ApiError("Projeto nao encontrado", 404);
    }

    const projectData = buildProjectData(
      input.data,
      input.data.thumbnail ?? currentProject.thumbnail,
      currentProject.published_at,
    );

    if (!projectData.slug) {
      throw new ApiError("Nao foi possivel gerar um slug valido", 400);
    }

    const projectWithSlug = await this.projectRepository.findBySlug({ slug: projectData.slug });

    if (projectWithSlug && projectWithSlug.id !== input.project_id) {
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

    const nextImageOrder =
      currentProject.images.reduce((highest, image) => Math.max(highest, image.sort_order), -1) + 1;

    if (currentProject.images.length + (input.data.images?.length ?? 0) > 10) {
      throw new ApiError("A galeria aceita no maximo 10 imagens", 400);
    }

    const project = await this.projectRepository.update({
      project_id: input.project_id,
      data: projectData,
      stack_ids: uniqueStackIds,
      images: (input.data.images ?? []).map((image, index) => ({
        ...image,
        sort_order: nextImageOrder + index,
      })),
    });

    return {
      project,
      replaced_thumbnail: input.data.thumbnail ? currentProject.thumbnail : null,
    };
  }
}
