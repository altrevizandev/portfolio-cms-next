import type { StackContract } from "../../contracts/StackContract.js";
import type { StackDeleteDTO } from "../../dtos/stack/StackDeleteDTO.js";

import { ApiError } from "../../utils/ApiError.js";

export class StackDeleteService {
  constructor(private readonly stackRepository: StackContract) {}

  public async execute(input: StackDeleteDTO) {
    if (!(await this.stackRepository.findById({ stack_id: input.stack_id }))) {
      throw new ApiError("Stack nao encontrada", 404);
    }

    if ((await this.stackRepository.countProjects({ stack_id: input.stack_id })) > 0) {
      throw new ApiError(
        "A stack nao pode ser removida enquanto estiver vinculada a projetos",
        409,
      );
    }

    await this.stackRepository.delete({ stack_id: input.stack_id });
  }
}
