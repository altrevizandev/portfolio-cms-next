import type { FastifyReply, FastifyRequest } from "fastify";
import { StackDeleteService } from "../../services/stack/Delete-service.js";

export type StackDeleteRequest = {
  Params: { stack_id: string };
};

export class StackDeleteController {
  private readonly stackDeleteService = new StackDeleteService();

  public async handle(
    request: FastifyRequest<StackDeleteRequest>,
    reply: FastifyReply,
  ) {
    this.stackDeleteService.stack_id = request.params.stack_id;
    await this.stackDeleteService.execute();
    return reply.code(204).send();
  }
}
