import type { FastifyReply, FastifyRequest } from "fastify";
import { makeEducationDeleteService } from "../../factories/education/make-services.js";
import type { EducationMutationRequest } from "./Requests.js";

export class EducationDeleteController {
  private readonly service = makeEducationDeleteService();
  async handle(request: FastifyRequest<EducationMutationRequest>, reply: FastifyReply) {
    await this.service.execute({ education_id: request.params.education_id });
    return reply.code(204).send();
  }
}
