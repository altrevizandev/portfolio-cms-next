import type { FastifyReply, FastifyRequest } from "fastify";
import { makeExperienceAdminListService } from "../../factories/experience/make-services.js";

export class ExperienceAdminListController {
  private readonly service = makeExperienceAdminListService();
  async handle(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ experiences: await this.service.execute() });
  }
}
