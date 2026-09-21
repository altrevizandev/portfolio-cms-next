import type { StackContract } from "../../contracts/StackContract.js";

export class StackListService {
  constructor(private readonly stackRepository: StackContract) {}

  public async execute() {
    return this.stackRepository.list();
  }
}
