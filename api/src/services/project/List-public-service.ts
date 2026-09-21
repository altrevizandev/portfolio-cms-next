import type { ProjectContract } from "../../contracts/ProjectContract.js";

export class ProjectPublicListService {
  constructor(private readonly projectRepository: ProjectContract) {}

  public async execute() {
    return this.projectRepository.listPublished();
  }
}
