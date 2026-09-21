import type { FastifyReply, FastifyRequest } from "fastify";
import { makeExperienceUpdateService } from "../../factories/experience/make-services.js";
import type { ExperienceMutationRequest } from "./Requests.js";

export class ExperienceUpdateController {
  private readonly service = makeExperienceUpdateService();
  async handle(request: FastifyRequest<ExperienceMutationRequest>, reply: FastifyReply) {
    return reply
      .code(200)
      .send({
        experience: await this.service.execute({
          experience_id: request.params.experience_id,
          data: request.body,
        }),
      });
  }
}
