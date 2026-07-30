import type { FastifyReply, FastifyRequest } from "fastify";
import { ProjectAdminDetailsService } from "../../services/project/Details-admin-service.js";

export type ProjectAdminDetailsRequest = {
  Params: { project_id: string };
};

export class ProjectAdminDetailsController {
  private readonly service = new ProjectAdminDetailsService();

  public async handle(
    request: FastifyRequest<ProjectAdminDetailsRequest>,
    reply: FastifyReply,
  ) {
    this.service.project_id = request.params.project_id;
    return reply.code(200).send({ project: await this.service.execute() });
  }
}
