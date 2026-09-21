import type { FastifyReply, FastifyRequest } from "fastify";
import { makeMeService } from "../../factories/auth/make-services.js";
import { MeService } from "../../services/auth/Me-service.js";

export class MeController {
  private readonly meService: MeService;

  constructor() {
    this.meService = makeMeService();
  }

  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const account = await this.meService.execute({ account_id: request.user.sub });

    return reply.code(200).send({
      account,
    });
  }
}
