import type { ExperienceContract } from "../../contracts/ExperienceContract.js";
import type { ExperienceDeleteDTO } from "../../dtos/experience/ExperienceDTO.js";
import { ApiError } from "../../utils/ApiError.js";

export class ExperienceDeleteService {
  constructor(private readonly repository: ExperienceContract) {}

  async execute(input: ExperienceDeleteDTO) {
    if (!(await this.repository.findById({ experience_id: input.experience_id }))) {
      throw new ApiError("Experiencia nao encontrada", 404);
    }
    await this.repository.delete({ experience_id: input.experience_id });
  }
}
