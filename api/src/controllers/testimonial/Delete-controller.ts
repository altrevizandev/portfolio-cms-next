import type { FastifyReply, FastifyRequest } from "fastify";
import { makeTestimonialDeleteService } from "../../factories/testimonial/make-services.js";
import { removeUploadedFile } from "../../utils/uploads.js";
import type { TestimonialMutationRequest } from "./Requests.js";

export class TestimonialDeleteController {
  private readonly service = makeTestimonialDeleteService();
  async handle(request: FastifyRequest<TestimonialMutationRequest>, reply: FastifyReply) {
    const testimonial = await this.service.execute({
      testimonial_id: request.params.testimonial_id,
    });
    await removeUploadedFile(testimonial.avatar);
    return reply.code(204).send();
  }
}
