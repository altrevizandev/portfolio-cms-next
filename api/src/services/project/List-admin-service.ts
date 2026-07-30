import { ProjectRepository } from "../../repositories/Project-repository.js";

export class ProjectAdminListService {
  private readonly projectRepository = new ProjectRepository();

  public async execute() {
    return this.projectRepository.listAdmin();
  }
}
