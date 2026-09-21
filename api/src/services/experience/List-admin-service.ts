import type { ExperienceContract } from "../../contracts/ExperienceContract.js";

export class ExperienceAdminListService {
  constructor(private readonly repository: ExperienceContract) {}

  execute() {
    return this.repository.listAdmin();
  }
}
