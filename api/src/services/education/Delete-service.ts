import type { EducationContract } from "../../contracts/EducationContract.js";
import type { EducationDeleteDTO } from "../../dtos/education/EducationDTO.js";
import { ApiError } from "../../utils/ApiError.js";

export class EducationDeleteService {
  constructor(private readonly repository: EducationContract) {}

  async execute(input: EducationDeleteDTO) {
    if (!(await this.repository.findById({ education_id: input.education_id }))) {
      throw new ApiError("Formacao nao encontrada", 404);
    }
    await this.repository.delete({ education_id: input.education_id });
  }
}
