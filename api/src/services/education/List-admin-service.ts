import type { EducationContract } from "../../contracts/EducationContract.js";

export class EducationAdminListService {
  constructor(private readonly repository: EducationContract) {}

  execute() {
    return this.repository.listAdmin();
  }
}
