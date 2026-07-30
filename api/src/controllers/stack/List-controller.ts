import type { FastifyReply, FastifyRequest } from "fastify";
import { StackListService } from "../../services/stack/List-service.js";

export class StackListController {
  private readonly stackListService = new StackListService();

  public async handle(_request: FastifyRequest, reply: FastifyReply) {
    const stacks = await this.stackListService.execute();
    return reply.code(200).send({ stacks });
  }
}
