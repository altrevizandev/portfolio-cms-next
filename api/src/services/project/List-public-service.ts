import { ProjectRepository } from "../../repositories/Project-repository.js";

export class ProjectPublicListService {
  private readonly projectRepository = new ProjectRepository();

  public async execute() {
    return this.projectRepository.listPublished();
  }
}
