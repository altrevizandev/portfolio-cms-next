import type { FastifyReply, FastifyRequest } from "fastify";
import { makeProjectAdminListService } from "../../factories/project/make-services.js";

export class ProjectAdminListController {
  private readonly service = makeProjectAdminListService();

  public async handle(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ projects: await this.service.execute() });
  }
}
