import type { FastifyReply, FastifyRequest } from "fastify";
import { makeTestimonialAdminListService } from "../../factories/testimonial/make-services.js";

export class TestimonialAdminListController {
  private readonly service = makeTestimonialAdminListService();
  async handle(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ testimonials: await this.service.execute() });
  }
}
