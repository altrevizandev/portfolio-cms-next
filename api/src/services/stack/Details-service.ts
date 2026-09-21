import type { StackContract } from "../../contracts/StackContract.js";
import type { StackDetailsDTO } from "../../dtos/stack/StackDetailsDTO.js";

import { ApiError } from "../../utils/ApiError.js";

export class StackDetailsService {
  constructor(private readonly stackRepository: StackContract) {}

  public async execute(input: StackDetailsDTO) {
    const stack = await this.stackRepository.findById({ stack_id: input.stack_id });

    if (!stack) {
      throw new ApiError("Stack nao encontrada", 404);
    }

    return stack;
  }
}
