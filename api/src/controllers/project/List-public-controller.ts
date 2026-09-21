import type { FastifyReply, FastifyRequest } from "fastify";
import { makeProjectPublicListService } from "../../factories/project/make-services.js";

export class ProjectPublicListController {
  private readonly service = makeProjectPublicListService();

  public async handle(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ projects: await this.service.execute() });
  }
}
