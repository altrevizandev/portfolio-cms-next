import type { FastifyReply, FastifyRequest } from "fastify";
import { ProjectDeleteImageService } from "../../services/project/Delete-image-service.js";
import { removeUploadedFile } from "../../utils/uploads.js";

export type ProjectDeleteImageRequest = {
  Params: { project_id: string; image_id: string };
};

export class ProjectDeleteImageController {
  private readonly service = new ProjectDeleteImageService();

  public async handle(
    request: FastifyRequest<ProjectDeleteImageRequest>,
    reply: FastifyReply,
  ) {
    this.service.project_id = request.params.project_id;
    this.service.image_id = request.params.image_id;
    const path = await this.service.execute();
    await removeUploadedFile(path);
    return reply.code(204).send();
  }
}
