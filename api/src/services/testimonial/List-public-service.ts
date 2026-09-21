import type { TestimonialContract } from "../../contracts/TestimonialContract.js";

export class TestimonialPublicListService {
  constructor(private readonly repository: TestimonialContract) {}

  execute() {
    return this.repository.listPublic();
  }
}
