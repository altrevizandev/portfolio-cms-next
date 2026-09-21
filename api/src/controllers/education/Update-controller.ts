import type { FastifyReply, FastifyRequest } from "fastify";
import { makeEducationUpdateService } from "../../factories/education/make-services.js";
import type { EducationMutationRequest } from "./Requests.js";

export class EducationUpdateController {
  private readonly service = makeEducationUpdateService();
  async handle(request: FastifyRequest<EducationMutationRequest>, reply: FastifyReply) {
    return reply
      .code(200)
      .send({
        education: await this.service.execute({
          education_id: request.params.education_id,
          data: request.body,
        }),
      });
  }
}
