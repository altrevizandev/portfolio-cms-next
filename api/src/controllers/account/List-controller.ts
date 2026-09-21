import type { FastifyReply, FastifyRequest } from "fastify";
import { makeListAccountsService } from "../../factories/account/make-services.js";
import { ListAccountsService } from "../../services/account/List-service.js";

export class ListAccountsController {
  private readonly listAccountsService: ListAccountsService;

  constructor() {
    this.listAccountsService = makeListAccountsService();
  }

  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const accounts = await this.listAccountsService.execute();

    return reply.code(200).send(accounts);
  }
}
