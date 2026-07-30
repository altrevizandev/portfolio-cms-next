import type { FastifyReply, FastifyRequest } from "fastify";
import { StackDetailsService } from "../../services/stack/Details-service.js";

export type StackDetailsRequest = {
  Params: { stack_id: string };
};

export class StackDetailsController {
  private readonly stackDetailsService = new StackDetailsService();

  public async handle(
    request: FastifyRequest<StackDetailsRequest>,
    reply: FastifyReply,
  ) {
    this.stackDetailsService.stack_id = request.params.stack_id;
    const stack = await this.stackDetailsService.execute();
    return reply.code(200).send({ stack });
  }
}
