import type { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateAccountService } from "../../factories/account/make-services.js";
import { CreateAccountService } from "../../services/account/Create-service.js";

type CreateAccountData = {
  name: string;
  email: string;
  role: string;
};

export type CreateAccountRequest = {
  Body: CreateAccountData;
};

export class CreateAccountController {
  private readonly createAccountService: CreateAccountService;

  constructor() {
    this.createAccountService = makeCreateAccountService();
  }

  public async handle(request: FastifyRequest<CreateAccountRequest>, reply: FastifyReply) {
    const { name, email, role } = request.body;

    const account = await this.createAccountService.execute({
      name: name,
      email: email,
      role: role,
    });

    return reply.code(201).send({
      account,
    });
  }
}
