import type { FastifyReply, FastifyRequest } from "fastify";
import { makeExperienceCreateService } from "../../factories/experience/make-services.js";
import type { ExperienceMutationRequest } from "./Requests.js";

export class ExperienceCreateController {
  private readonly service = makeExperienceCreateService();
  async handle(request: FastifyRequest<ExperienceMutationRequest>, reply: FastifyReply) {
    return reply.code(201).send({ experience: await this.service.execute({ data: request.body }) });
  }
}
