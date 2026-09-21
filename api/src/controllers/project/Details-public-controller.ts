import type { FastifyReply, FastifyRequest } from "fastify";
import { makeProjectPublicDetailsService } from "../../factories/project/make-services.js";

export type ProjectPublicDetailsRequest = {
  Params: { slug: string };
};

export class ProjectPublicDetailsController {
  private readonly service = makeProjectPublicDetailsService();

  public async handle(request: FastifyRequest<ProjectPublicDetailsRequest>, reply: FastifyReply) {
    return reply
      .code(200)
      .send({ project: await this.service.execute({ slug: request.params.slug }) });
  }
}
