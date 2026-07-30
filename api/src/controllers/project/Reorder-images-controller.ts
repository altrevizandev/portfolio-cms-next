import type { FastifyReply, FastifyRequest } from "fastify";
import { ProjectReorderImagesService } from "../../services/project/Reorder-images-service.js";

export type ProjectReorderImagesRequest = {
  Params: { project_id: string };
  Body: { image_ids: string[] };
};

export class ProjectReorderImagesController {
  private readonly service = new ProjectReorderImagesService();

  public async handle(
    request: FastifyRequest<ProjectReorderImagesRequest>,
    reply: FastifyReply,
  ) {
    this.service.project_id = request.params.project_id;
    this.service.image_ids = request.body.image_ids;
    return reply.code(200).send({ images: await this.service.execute() });
  }
}
