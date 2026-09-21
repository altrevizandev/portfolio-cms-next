import type { FastifyReply, FastifyRequest } from "fastify";
import { makeExperiencePublicListService } from "../../factories/experience/make-services.js";

export class ExperiencePublicListController {
  private readonly service = makeExperiencePublicListService();
  async handle(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ experiences: await this.service.execute() });
  }
}
