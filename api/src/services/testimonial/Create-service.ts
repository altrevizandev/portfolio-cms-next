import type { RecaptchaContract } from "../../contracts/RecaptchaContract.js";
import type { TestimonialContract } from "../../contracts/TestimonialContract.js";
import type { TestimonialCreateDTO } from "../../dtos/testimonial/TestimonialDTO.js";
import { type TestimonialData } from "../../dtos/testimonial/TestimonialData.js";

export class TestimonialCreateService {
  constructor(
    private readonly repository: TestimonialContract,
    private readonly recaptcha: RecaptchaContract,
  ) {}

  async execute(input: TestimonialCreateDTO) {
    await this.recaptcha.execute({
      token: input.data.recaptcha_token,
      expected_action: "submit_testimonial",
    });

    const data: TestimonialData = {
      author_name: input.data.author_name.trim(),
      author_role: input.data.author_role?.trim() || null,
      company: input.data.company?.trim() || null,
      avatar: input.data.avatar ?? null,
      content: input.data.content.trim(),
    };
    return this.repository.create(data);
  }
}
