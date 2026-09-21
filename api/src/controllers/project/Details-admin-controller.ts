import type { FastifyReply, FastifyRequest } from "fastify";
import { makeProjectAdminDetailsService } from "../../factories/project/make-services.js";

export type ProjectAdminDetailsRequest = {
  Params: { project_id: string };
};

export class ProjectAdminDetailsController {
  private readonly service = makeProjectAdminDetailsService();

  public async handle(request: FastifyRequest<ProjectAdminDetailsRequest>, reply: FastifyReply) {
    return reply
      .code(200)
      .send({ project: await this.service.execute({ project_id: request.params.project_id }) });
  }
}
