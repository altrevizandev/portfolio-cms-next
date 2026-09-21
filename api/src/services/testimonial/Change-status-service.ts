import type { TestimonialContract } from "../../contracts/TestimonialContract.js";
import type { TestimonialStatusDTO } from "../../dtos/testimonial/TestimonialDTO.js";
import { ApiError } from "../../utils/ApiError.js";

export class TestimonialStatusService {
  constructor(private readonly repository: TestimonialContract) {}

  async execute(input: TestimonialStatusDTO) {
    if (!(await this.repository.findById({ testimonial_id: input.testimonial_id }))) {
      throw new ApiError("Depoimento nao encontrado", 404);
    }
    return this.repository.updateStatus({ testimonial_id: input.testimonial_id }, input.status);
  }
}
