import type { FastifyReply, FastifyRequest } from "fastify";
import { makeExperienceDeleteService } from "../../factories/experience/make-services.js";
import type { ExperienceMutationRequest } from "./Requests.js";

export class ExperienceDeleteController {
  private readonly service = makeExperienceDeleteService();
  async handle(request: FastifyRequest<ExperienceMutationRequest>, reply: FastifyReply) {
    await this.service.execute({ experience_id: request.params.experience_id });
    return reply.code(204).send();
  }
}
