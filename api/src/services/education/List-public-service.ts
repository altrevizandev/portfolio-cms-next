import type { EducationContract } from "../../contracts/EducationContract.js";

export class EducationPublicListService {
  constructor(private readonly repository: EducationContract) {}

  execute() {
    return this.repository.listPublic();
  }
}
