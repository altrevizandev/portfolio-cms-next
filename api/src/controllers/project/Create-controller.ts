import type { FastifyReply, FastifyRequest } from "fastify";
import { ProjectCreateService } from "../../services/project/Create-service.js";
import { removeUploadedFile } from "../../utils/uploads.js";
import { parseProjectMultipart } from "./multipart.js";

export class ProjectCreateController {
  private readonly service = new ProjectCreateService();

  public async handle(request: FastifyRequest, reply: FastifyReply) {
    let uploadedPaths: string[] = [];

    try {
      const parsed = await parseProjectMultipart(request, uploadedPaths);
      this.service.data = parsed.input;

      return reply.code(201).send({
        project: await this.service.execute(),
      });
    } catch (error) {
      await Promise.allSettled(uploadedPaths.map(removeUploadedFile));
      throw error;
    }
  }
}
