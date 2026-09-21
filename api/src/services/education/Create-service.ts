import type { EducationContract } from "../../contracts/EducationContract.js";
import type { EducationCreateDTO } from "../../dtos/education/EducationDTO.js";
import { normalize } from "./Normalize-data.js";

export class EducationCreateService {
  constructor(private readonly repository: EducationContract) {}

  execute(input: EducationCreateDTO) {
    return this.repository.create({ data: normalize(input.data) });
  }
}
