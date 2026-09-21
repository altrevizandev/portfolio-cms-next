import type { ProjectContract } from "../../contracts/ProjectContract.js";

export class ProjectAdminListService {
  constructor(private readonly projectRepository: ProjectContract) {}

  public async execute() {
    return this.projectRepository.listAdmin();
  }
}
