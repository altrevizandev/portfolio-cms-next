import type { FastifyReply, FastifyRequest } from "fastify";
import { makeStackCreateService } from "../../factories/stack/make-services.js";
import { type StackInput } from "../../services/stack/Create-service.js";

export type StackCreateRequest = {
  Body: StackInput;
};

export class StackCreateController {
  private readonly stackCreateService = makeStackCreateService();

  public async handle(request: FastifyRequest<StackCreateRequest>, reply: FastifyReply) {
    const stack = await this.stackCreateService.execute({ data: request.body });
    return reply.code(201).send({ stack });
  }
}
