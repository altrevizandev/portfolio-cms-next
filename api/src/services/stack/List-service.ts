import { StackRepository } from "../../repositories/Stack-repository.js";

export class StackListService {
  private readonly stackRepository: StackRepository;

  constructor() {
    this.stackRepository = new StackRepository();
  }

  public async execute() {
    return this.stackRepository.list();
  }
}
