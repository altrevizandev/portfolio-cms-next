import type { FastifyReply, FastifyRequest } from "fastify";
import { makeAccountUpdateService } from "../../factories/account/make-services.js";
import { AccountUpdateService } from "../../services/account/Update-service.js";

type AccountUpdateProps = {
  account_id: number;
  name: string;
  email: string;
  role: string;
};

export type AccountUpdateRequest = {
  Body: AccountUpdateProps;
};

export class AccountUpdateController {
  private readonly accountUpdateService: AccountUpdateService;

  constructor() {
    this.accountUpdateService = makeAccountUpdateService();
  }

  public async handle(request: FastifyRequest<AccountUpdateRequest>, reply: FastifyReply) {
    const { account_id, name, email, role } = request.body;

    const account = await this.accountUpdateService.execute({
      account_id: account_id,
      name: name,
      email: email,
      role: role,
    });

    return reply.code(200).send({ account });
  }
}
