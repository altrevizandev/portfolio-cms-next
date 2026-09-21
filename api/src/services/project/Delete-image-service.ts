import type { ProjectContract } from "../../contracts/ProjectContract.js";
import type { ProjectDeleteImageDTO } from "../../dtos/project/ProjectDeleteImageDTO.js";

import { ApiError } from "../../utils/ApiError.js";

export class ProjectDeleteImageService {
  constructor(private readonly projectRepository: ProjectContract) {}

  public async execute(input: ProjectDeleteImageDTO) {
    const image = await this.projectRepository.findImageById({
      image_id: input.image_id,
      project_id: input.project_id,
    });

    if (!image) {
      throw new ApiError("Imagem do projeto nao encontrada", 404);
    }

    await this.projectRepository.deleteImage({ image_id: input.image_id });
    return image.path;
  }
}
