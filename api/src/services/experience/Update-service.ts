import type { ExperienceContract } from "../../contracts/ExperienceContract.js";
import type { ExperienceUpdateDTO } from "../../dtos/experience/ExperienceDTO.js";
import { ApiError } from "../../utils/ApiError.js";
import { normalize } from "./Normalize-data.js";

export class ExperienceUpdateService {
  constructor(private readonly repository: ExperienceContract) {}

  async execute(input: ExperienceUpdateDTO) {
    if (!(await this.repository.findById({ experience_id: input.experience_id }))) {
      throw new ApiError("Experiencia nao encontrada", 404);
    }

    return this.repository.update({
      experience_id: input.experience_id,
      data: normalize(input.data),
    });
  }
}
