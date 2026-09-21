import type { FastifyReply, FastifyRequest } from "fastify";
import { makeStackDetailsService } from "../../factories/stack/make-services.js";

export type StackDetailsRequest = {
  Params: { stack_id: string };
};

export class StackDetailsController {
  private readonly stackDetailsService = makeStackDetailsService();

  public async handle(request: FastifyRequest<StackDetailsRequest>, reply: FastifyReply) {
    const stack = await this.stackDetailsService.execute({ stack_id: request.params.stack_id });
    return reply.code(200).send({ stack });
  }
}
