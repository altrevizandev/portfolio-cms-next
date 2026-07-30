import type { FastifyReply, FastifyRequest } from "fastify";
import { ProjectPublicDetailsService } from "../../services/project/Details-public-service.js";

export type ProjectPublicDetailsRequest = {
  Params: { slug: string };
};

export class ProjectPublicDetailsController {
  private readonly service = new ProjectPublicDetailsService();

  public async handle(
    request: FastifyRequest<ProjectPublicDetailsRequest>,
    reply: FastifyReply,
  ) {
    this.service.slug = request.params.slug;
    return reply.code(200).send({ project: await this.service.execute() });
  }
}
