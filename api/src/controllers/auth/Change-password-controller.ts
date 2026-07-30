import type { FastifyReply, FastifyRequest } from "fastify";
import { ChangePasswordService } from "../../services/auth/Change-password-service.js";

type ChangePasswordProps = {
  password: string
}

export type ChangePasswordRequest = {
  Body: ChangePasswordProps
}

export class ChangePasswordController {
  private readonly changePasswordService: ChangePasswordService;
 
  constructor() {
    this.changePasswordService = new ChangePasswordService();
  }

  public async handle(request: FastifyRequest<ChangePasswordRequest>, reply: FastifyReply) {
    const {
      password
    } = request.body;

    this.changePasswordService.account_id = request.user.sub;
    this.changePasswordService.password = password;

    await this.changePasswordService.execute();

    return reply.code(200).send({
      message: "Senha alterada com sucesso"
    });
  }
}
