import type { FastifyReply, FastifyRequest } from "fastify";
import { makeStackListService } from "../../factories/stack/make-services.js";

export class StackListController {
  private readonly stackListService = makeStackListService();

  public async handle(_request: FastifyRequest, reply: FastifyReply) {
    const stacks = await this.stackListService.execute();
    return reply.code(200).send({ stacks });
  }
}
