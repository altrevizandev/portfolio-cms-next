import type { EducationContract } from "../../contracts/EducationContract.js";
import type { EducationUpdateDTO } from "../../dtos/education/EducationDTO.js";
import { ApiError } from "../../utils/ApiError.js";
import { normalize } from "./Normalize-data.js";

export class EducationUpdateService {
  constructor(private readonly repository: EducationContract) {}

  async execute(input: EducationUpdateDTO) {
    if (!(await this.repository.findById({ education_id: input.education_id }))) {
      throw new ApiError("Formacao nao encontrada", 404);
    }

    return this.repository.update({
      education_id: input.education_id,
      data: normalize(input.data),
    });
  }
}
