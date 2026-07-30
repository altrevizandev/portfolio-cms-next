import type { FastifyReply, FastifyRequest } from "fastify";
import { ProjectPublicListService } from "../../services/project/List-public-service.js";

export class ProjectPublicListController {
  private readonly service = new ProjectPublicListService();

  public async handle(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ projects: await this.service.execute() });
  }
}
