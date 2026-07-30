import { ProjectRepository } from "../../repositories/Project-repository.js";
import { ApiError } from "../../utils/ApiError.js";

export class ProjectDeleteImageService {
  public project_id = "";
  public image_id = "";
  private readonly projectRepository = new ProjectRepository();

  public async execute() {
    this.projectRepository.project_id = this.project_id;
    this.projectRepository.image_id = this.image_id;

    const image = await this.projectRepository.findImageById();

    if (!image) {
      throw new ApiError("Imagem do projeto nao encontrada", 404);
    }

    await this.projectRepository.deleteImage();
    return image.path;
  }
}
