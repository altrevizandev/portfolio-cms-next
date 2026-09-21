import type { FastifyReply, FastifyRequest } from "fastify";
import { makeProjectCreateService } from "../../factories/project/make-services.js";
import { removeUploadedFile } from "../../utils/uploads.js";
import { parseProjectMultipart } from "./multipart.js";

export class ProjectCreateController {
  private readonly service = makeProjectCreateService();

  public async handle(request: FastifyRequest, reply: FastifyReply) {
    let uploadedPaths: string[] = [];

    try {
      const parsed = await parseProjectMultipart(request, uploadedPaths);

      return reply.code(201).send({
        project: await this.service.execute({ data: parsed.input }),
      });
    } catch (error) {
      await Promise.allSettled(uploadedPaths.map(removeUploadedFile));
      throw error;
    }
  }
}
