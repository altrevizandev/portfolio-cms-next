import { StackRepository } from "../../repositories/Stack-repository.js";
import { ApiError } from "../../utils/ApiError.js";

export class StackDetailsService {
  public stack_id = "";
  private readonly stackRepository: StackRepository;

  constructor() {
    this.stackRepository = new StackRepository();
  }

  public async execute() {
    this.stackRepository.stack_id = this.stack_id;

    const stack = await this.stackRepository.findById();

    if (!stack) {
      throw new ApiError("Stack nao encontrada", 404);
    }

    return stack;
  }
}
