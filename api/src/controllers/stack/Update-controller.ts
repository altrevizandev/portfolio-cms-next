import type { FastifyReply, FastifyRequest } from "fastify";
import type { StackInput } from "../../services/stack/Create-service.js";
import { StackUpdateService } from "../../services/stack/Update-service.js";

export type StackUpdateRequest = {
  Params: { stack_id: string };
  Body: StackInput;
};

export class StackUpdateController {
  private readonly stackUpdateService = new StackUpdateService();

  public async handle(
    request: FastifyRequest<StackUpdateRequest>,
    reply: FastifyReply,
  ) {
    this.stackUpdateService.stack_id = request.params.stack_id;
    this.stackUpdateService.data = request.body;
    const stack = await this.stackUpdateService.execute();
    return reply.code(200).send({ stack });
  }
}
