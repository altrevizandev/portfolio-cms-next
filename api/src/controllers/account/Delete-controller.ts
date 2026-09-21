import type { FastifyReply, FastifyRequest } from "fastify";
import { makeAccountDeleteService } from "../../factories/account/make-services.js";
import { AccountDeleteService } from "../../services/account/Delete-service.js";

type AccountDeleteParams = {
  account_id: number;
};

export type AccountDeleteRequest = {
  Params: AccountDeleteParams;
};

export class AccountDeleteController {
  private readonly accountDeleteService: AccountDeleteService;

  constructor() {
    this.accountDeleteService = makeAccountDeleteService();
  }

  public async handle(request: FastifyRequest<AccountDeleteRequest>, reply: FastifyReply) {
    const { account_id } = request.params;

    await this.accountDeleteService.execute({ account_id: Number(account_id) });

    return reply.code(204).send();
  }
}
