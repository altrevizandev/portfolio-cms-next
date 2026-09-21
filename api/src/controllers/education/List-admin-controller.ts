import type { FastifyReply, FastifyRequest } from "fastify";
import { makeEducationAdminListService } from "../../factories/education/make-services.js";

export class EducationAdminListController {
  private readonly service = makeEducationAdminListService();
  async handle(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ education: await this.service.execute() });
  }
}
