import type { FastifyReply, FastifyRequest } from "fastify";
import {
  StackCreateService,
  type StackInput,
} from "../../services/stack/Create-service.js";

export type StackCreateRequest = {
  Body: StackInput;
};

export class StackCreateController {
  private readonly stackCreateService = new StackCreateService();

  public async handle(
    request: FastifyRequest<StackCreateRequest>,
    reply: FastifyReply,
  ) {
    this.stackCreateService.data = request.body;
    const stack = await this.stackCreateService.execute();
    return reply.code(201).send({ stack });
  }
}
