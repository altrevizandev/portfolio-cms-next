import type { FastifyReply, FastifyRequest } from "fastify";
import { makeEducationCreateService } from "../../factories/education/make-services.js";
import type { EducationMutationRequest } from "./Requests.js";

export class EducationCreateController {
  private readonly service = makeEducationCreateService();
  async handle(request: FastifyRequest<EducationMutationRequest>, reply: FastifyReply) {
    return reply.code(201).send({ education: await this.service.execute({ data: request.body }) });
  }
}
