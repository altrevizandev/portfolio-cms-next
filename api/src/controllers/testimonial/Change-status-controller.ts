import type { FastifyReply, FastifyRequest } from "fastify";
import { makeTestimonialStatusService } from "../../factories/testimonial/make-services.js";
import type { TestimonialMutationRequest } from "./Requests.js";

export class TestimonialStatusController {
  private readonly service = makeTestimonialStatusService();
  async handle(request: FastifyRequest<TestimonialMutationRequest>, reply: FastifyReply) {
    return reply
      .code(200)
      .send({
        testimonial: await this.service.execute({
          testimonial_id: request.params.testimonial_id,
          status: request.body.status,
        }),
      });
  }
}
