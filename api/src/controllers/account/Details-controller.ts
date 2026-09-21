import type { FastifyReply, FastifyRequest } from "fastify";
import { makeAccountDetailsService } from "../../factories/account/make-services.js";
import { AccountDetailsService } from "../../services/account/Details-service.js";

export type AccountDetailsControllerRequest = {
  Params: {
    account_id: number;
  };
};

export class AccountDetailsController {
  private readonly accountDetailsService: AccountDetailsService;

  constructor() {
    this.accountDetailsService = makeAccountDetailsService();
  }

  public async handle(
    request: FastifyRequest<AccountDetailsControllerRequest>,
    reply: FastifyReply,
  ) {
    const { account_id } = request.params;

    const account = await this.accountDetailsService.execute({ account_id: Number(account_id) });

    return reply.code(200).send({ account });
  }
}
