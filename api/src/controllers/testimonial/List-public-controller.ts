import type { FastifyReply, FastifyRequest } from "fastify";
import { makeTestimonialPublicListService } from "../../factories/testimonial/make-services.js";

export class TestimonialPublicListController {
  private readonly service = makeTestimonialPublicListService();
  async handle(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ testimonials: await this.service.execute() });
  }
}
