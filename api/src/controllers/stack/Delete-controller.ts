import type { FastifyReply, FastifyRequest } from "fastify";
import { makeStackDeleteService } from "../../factories/stack/make-services.js";

export type StackDeleteRequest = {
  Params: { stack_id: string };
};

export class StackDeleteController {
  private readonly stackDeleteService = makeStackDeleteService();

  public async handle(request: FastifyRequest<StackDeleteRequest>, reply: FastifyReply) {
    await this.stackDeleteService.execute({ stack_id: request.params.stack_id });
    return reply.code(204).send();
  }
}
