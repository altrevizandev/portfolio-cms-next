import type { ExperienceContract } from "../../contracts/ExperienceContract.js";
import type { ExperienceCreateDTO } from "../../dtos/experience/ExperienceDTO.js";
import { normalize } from "./Normalize-data.js";

export class ExperienceCreateService {
  constructor(private readonly repository: ExperienceContract) {}

  execute(input: ExperienceCreateDTO) {
    return this.repository.create({ data: normalize(input.data) });
  }
}
