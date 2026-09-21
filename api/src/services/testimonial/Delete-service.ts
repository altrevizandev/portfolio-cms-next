import type { TestimonialContract } from "../../contracts/TestimonialContract.js";
import type { TestimonialDeleteDTO } from "../../dtos/testimonial/TestimonialDTO.js";
import { ApiError } from "../../utils/ApiError.js";

export class TestimonialDeleteService {
  constructor(private readonly repository: TestimonialContract) {}

  async execute(input: TestimonialDeleteDTO) {
    if (!(await this.repository.findById({ testimonial_id: input.testimonial_id }))) {
      throw new ApiError("Depoimento nao encontrado", 404);
    }
    return this.repository.delete({ testimonial_id: input.testimonial_id });
  }
}
