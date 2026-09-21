import type { FastifyReply, FastifyRequest } from "fastify";
import { makeProjectDeleteImageService } from "../../factories/project/make-services.js";
import { removeUploadedFile } from "../../utils/uploads.js";

export type ProjectDeleteImageRequest = {
  Params: { project_id: string; image_id: string };
};

export class ProjectDeleteImageController {
  private readonly service = makeProjectDeleteImageService();

  public async handle(request: FastifyRequest<ProjectDeleteImageRequest>, reply: FastifyReply) {
    const path = await this.service.execute({
      project_id: request.params.project_id,
      image_id: request.params.image_id,
    });
    await removeUploadedFile(path);
    return reply.code(204).send();
  }
}
