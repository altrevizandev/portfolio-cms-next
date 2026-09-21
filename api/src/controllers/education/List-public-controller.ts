import type { FastifyReply, FastifyRequest } from "fastify";
import { makeEducationPublicListService } from "../../factories/education/make-services.js";

export class EducationPublicListController {
  private readonly service = makeEducationPublicListService();
  async handle(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ education: await this.service.execute() });
  }
}
