import type { ExperienceContract } from "../../contracts/ExperienceContract.js";

export class ExperiencePublicListService {
  constructor(private readonly repository: ExperienceContract) {}

  execute() {
    return this.repository.listPublic();
  }
}
