import type { FastifyReply, FastifyRequest } from "fastify";
import { ProjectAdminListService } from "../../services/project/List-admin-service.js";

export class ProjectAdminListController {
  private readonly service = new ProjectAdminListService();

  public async handle(_request: FastifyRequest, reply: FastifyReply) {
    return reply.code(200).send({ projects: await this.service.execute() });
  }
}
