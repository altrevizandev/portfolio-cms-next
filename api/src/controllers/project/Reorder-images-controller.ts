import type { FastifyReply, FastifyRequest } from "fastify";
import { makeProjectReorderImagesService } from "../../factories/project/make-services.js";

export type ProjectReorderImagesRequest = {
  Params: { project_id: string };
  Body: { image_ids: string[] };
};

export class ProjectReorderImagesController {
  private readonly service = makeProjectReorderImagesService();

  public async handle(request: FastifyRequest<ProjectReorderImagesRequest>, reply: FastifyReply) {
    return reply
      .code(200)
      .send({
        images: await this.service.execute({
          project_id: request.params.project_id,
          image_ids: request.body.image_ids,
        }),
      });
  }
}
