import type { FastifyReply, FastifyRequest } from "fastify";
import { ProjectDeleteService } from "../../services/project/Delete-service.js";
import { removeUploadedFile } from "../../utils/uploads.js";

export type ProjectDeleteRequest = {
  Params: { project_id: string };
};

export class ProjectDeleteController {
  private readonly service = new ProjectDeleteService();

  public async handle(
    request: FastifyRequest<ProjectDeleteRequest>,
    reply: FastifyReply,
  ) {
    this.service.project_id = request.params.project_id;
    const paths = await this.service.execute();
    await Promise.allSettled(paths.map(removeUploadedFile));
    return reply.code(204).send();
  }
}
