import type { FastifyReply, FastifyRequest } from "fastify";
import { makeChangePasswordService } from "../../factories/auth/make-services.js";
import { ChangePasswordService } from "../../services/auth/Change-password-service.js";

type ChangePasswordProps = {
  password: string;
};

export type ChangePasswordRequest = {
  Body: ChangePasswordProps;
};

export class ChangePasswordController {
  private readonly changePasswordService: ChangePasswordService;

  constructor() {
    this.changePasswordService = makeChangePasswordService();
  }

  public async handle(request: FastifyRequest<ChangePasswordRequest>, reply: FastifyReply) {
    const { password } = request.body;

    await this.changePasswordService.execute({ account_id: request.user.sub, password: password });

    return reply.code(200).send({
      message: "Senha alterada com sucesso",
    });
  }
}
