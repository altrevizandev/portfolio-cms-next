import { TestimonialStatus } from "../../../prisma/generated/prisma/enums.js";
import {
  TestimonialRepository,
  type TestimonialData,
} from "../../repositories/Testimonial-repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { VerifyRecaptchaService } from "../security/Verify-recaptcha-service.js";

export type TestimonialInput = {
  author_name: string;
  author_role?: string | null;
  company?: string | null;
  avatar?: string | null;
  content: string;
  recaptcha_token: string;
};

export class TestimonialPublicListService {
  private readonly repository = new TestimonialRepository();
  execute() { return this.repository.listPublic(); }
}

export class TestimonialAdminListService {
  private readonly repository = new TestimonialRepository();
  execute() { return this.repository.listAdmin(); }
}

export class TestimonialCreateService {
  public data!: TestimonialInput;
  private readonly repository = new TestimonialRepository();

  async execute() {
    const recaptcha = new VerifyRecaptchaService();
    recaptcha.token = this.data.recaptcha_token;
    recaptcha.expected_action = "submit_testimonial";
    await recaptcha.execute();

    const data: TestimonialData = {
      author_name: this.data.author_name.trim(),
      author_role: this.data.author_role?.trim() || null,
      company: this.data.company?.trim() || null,
      avatar: this.data.avatar ?? null,
      content: this.data.content.trim(),
    };
    return this.repository.create(data);
  }
}

export class TestimonialStatusService {
  public testimonial_id = "";
  public status!: TestimonialStatus;
  private readonly repository = new TestimonialRepository();

  async execute() {
    this.repository.testimonial_id = this.testimonial_id;
    if (!(await this.repository.findById())) {
      throw new ApiError("Depoimento nao encontrado", 404);
    }
    return this.repository.updateStatus(this.status);
  }
}

export class TestimonialDeleteService {
  public testimonial_id = "";
  private readonly repository = new TestimonialRepository();

  async execute() {
    this.repository.testimonial_id = this.testimonial_id;
    if (!(await this.repository.findById())) {
      throw new ApiError("Depoimento nao encontrado", 404);
    }
    return this.repository.delete();
  }
}
