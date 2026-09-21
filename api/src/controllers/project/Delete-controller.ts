import type { FastifyReply, FastifyRequest } from "fastify";
import { makeProjectDeleteService } from "../../factories/project/make-services.js";
import { removeUploadedFile } from "../../utils/uploads.js";

export type ProjectDeleteRequest = {
  Params: { project_id: string };
};

export class ProjectDeleteController {
  private readonly service = makeProjectDeleteService();

  public async handle(request: FastifyRequest<ProjectDeleteRequest>, reply: FastifyReply) {
    const paths = await this.service.execute({ project_id: request.params.project_id });
    await Promise.allSettled(paths.map(removeUploadedFile));
    return reply.code(204).send();
  }
}
