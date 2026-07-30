import { StackRepository } from "../../repositories/Stack-repository.js";
import { ApiError } from "../../utils/ApiError.js";

export class StackDeleteService {
  public stack_id = "";
  private readonly stackRepository: StackRepository;

  constructor() {
    this.stackRepository = new StackRepository();
  }

  public async execute() {
    this.stackRepository.stack_id = this.stack_id;

    if (!(await this.stackRepository.findById())) {
      throw new ApiError("Stack nao encontrada", 404);
    }

    if ((await this.stackRepository.countProjects()) > 0) {
      throw new ApiError(
        "A stack nao pode ser removida enquanto estiver vinculada a projetos",
        409,
      );
    }

    await this.stackRepository.delete();
  }
}
