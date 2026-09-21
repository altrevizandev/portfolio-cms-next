import type { FastifyReply, FastifyRequest } from "fastify";
import { makeConfirmResetPasswordService } from "../../factories/auth/make-services.js";
import { ConfirmResetPasswordService } from "../../services/auth/Confirm-reset-password-service.js";

type ConfirmResetPasswordProps = {
  token: string;
  password: string;
  confirmPassword: string;
};

export type ConfirmResetPasswordRequest = {
  Body: ConfirmResetPasswordProps;
};

export class ConfirmResetPasswordController {
  private readonly confirmResetPasswordService: ConfirmResetPasswordService;

  constructor() {
    this.confirmResetPasswordService = makeConfirmResetPasswordService();
  }

  public async handle(request: FastifyRequest<ConfirmResetPasswordRequest>, reply: FastifyReply) {
    const { token, password } = request.body;

    await this.confirmResetPasswordService.execute({ token: token, password: password });

    return reply.code(204).send();
  }
}
