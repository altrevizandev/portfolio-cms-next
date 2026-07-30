import { ProjectRepository } from "../../repositories/Project-repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { buildProjectData, type ProjectInput } from "./Project-data.js";

export class ProjectUpdateService {
  public project_id = "";
  public data: ProjectInput = {
    title: "",
    description: "",
    objective: "",
    status: "DRAFT",
    featured: false,
    sort_order: 0,
    stack_ids: [],
  };

  private readonly projectRepository = new ProjectRepository();

  public async execute() {
    this.projectRepository.project_id = this.project_id;
    const currentProject = await this.projectRepository.findById();

    if (!currentProject) {
      throw new ApiError("Projeto nao encontrado", 404);
    }

    const projectData = buildProjectData(
      this.data,
      this.data.thumbnail ?? currentProject.thumbnail,
      currentProject.published_at,
    );

    if (!projectData.slug) {
      throw new ApiError("Nao foi possivel gerar um slug valido", 400);
    }

    this.projectRepository.slug = projectData.slug;
    const projectWithSlug = await this.projectRepository.findBySlug();

    if (projectWithSlug && projectWithSlug.id !== this.project_id) {
      throw new ApiError("Ja existe um projeto com este slug", 409);
    }

    const uniqueStackIds = [ ...new Set(this.data.stack_ids) ];
    this.projectRepository.stack_ids = uniqueStackIds;

    if (
      uniqueStackIds.length > 0 &&
      await this.projectRepository.countStacks() !== uniqueStackIds.length
    ) {
      throw new ApiError("Uma ou mais stacks informadas nao existem", 400);
    }

    const nextImageOrder =
      currentProject.images.reduce(
        (highest, image) => Math.max(highest, image.sort_order),
        -1,
      ) + 1;

    if (currentProject.images.length + (this.data.images?.length ?? 0) > 10) {
      throw new ApiError("A galeria aceita no maximo 10 imagens", 400);
    }

    this.projectRepository.data = projectData;
    this.projectRepository.images = (this.data.images ?? []).map(
      (image, index) => ({
        ...image,
        sort_order: nextImageOrder + index,
      }),
    );

    const project = await this.projectRepository.update();

    return {
      project,
      replaced_thumbnail:
        this.data.thumbnail ? currentProject.thumbnail : null,
    };
  }
}
