import { TestimonialRepository } from "../../repositories/Testimonial-repository.js";
import { VerifyRecaptchaService } from "../../services/security/Verify-recaptcha-service.js";
import {
  TestimonialAdminListService,
  TestimonialCreateService,
  TestimonialDeleteService,
  TestimonialPublicListService,
  TestimonialStatusService,
} from "../../services/testimonial/Testimonial-services.js";

export function makeTestimonialPublicListService() {
  return new TestimonialPublicListService(new TestimonialRepository());
}

export function makeTestimonialAdminListService() {
  return new TestimonialAdminListService(new TestimonialRepository());
}

export function makeTestimonialCreateService() {
  return new TestimonialCreateService(new TestimonialRepository(), new VerifyRecaptchaService());
}

export function makeTestimonialStatusService() {
  return new TestimonialStatusService(new TestimonialRepository());
}

export function makeTestimonialDeleteService() {
  return new TestimonialDeleteService(new TestimonialRepository());
}
