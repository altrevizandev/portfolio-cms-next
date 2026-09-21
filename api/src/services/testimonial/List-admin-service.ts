import type { TestimonialContract } from "../../contracts/TestimonialContract.js";

export class TestimonialAdminListService {
  constructor(private readonly repository: TestimonialContract) {}

  execute() {
    return this.repository.listAdmin();
  }
}
