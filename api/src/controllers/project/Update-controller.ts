import type { FastifyReply, FastifyRequest } from "fastify";
import { makeProjectUpdateService } from "../../factories/project/make-services.js";
import { removeUploadedFile } from "../../utils/uploads.js";
import { parseProjectMultipart } from "./multipart.js";

export type ProjectUpdateRequest = {
  Params: { project_id: string };
};

export class ProjectUpdateController {
  private readonly service = makeProjectUpdateService();

  public async handle(request: FastifyRequest<ProjectUpdateRequest>, reply: FastifyReply) {
    let uploadedPaths: string[] = [];

    try {
      const parsed = await parseProjectMultipart(request, uploadedPaths);

      const { project, replaced_thumbnail } = await this.service.execute({
        project_id: request.params.project_id,
        data: parsed.input,
      });

      if (replaced_thumbnail) {
        await removeUploadedFile(replaced_thumbnail);
      }

      return reply.code(200).send({ project });
    } catch (error) {
      await Promise.allSettled(uploadedPaths.map(removeUploadedFile));
      throw error;
    }
  }
}
