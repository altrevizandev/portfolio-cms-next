import type { FastifyReply, FastifyRequest } from "fastify";
import { makeStackUpdateService } from "../../factories/stack/make-services.js";
import type { StackInput } from "../../services/stack/Create-service.js";

export type StackUpdateRequest = {
  Params: { stack_id: string };
  Body: StackInput;
};

export class StackUpdateController {
  private readonly stackUpdateService = makeStackUpdateService();

  public async handle(request: FastifyRequest<StackUpdateRequest>, reply: FastifyReply) {
    const stack = await this.stackUpdateService.execute({
      stack_id: request.params.stack_id,
      data: request.body,
    });
    return reply.code(200).send({ stack });
  }
}
