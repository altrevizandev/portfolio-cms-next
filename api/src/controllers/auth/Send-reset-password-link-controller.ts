import type { FastifyReply, FastifyRequest } from "fastify";
import { makeSendResetPasswordLinkService } from "../../factories/auth/make-services.js";
import { SendResetPasswordLinkService } from "../../services/auth/Send-reset-password-link-service.js";
import { VerifyRecaptchaService } from "../../services/security/Verify-recaptcha-service.js";

type SendResetPasswordLinkProps = {
  email: string;
  recaptcha_token: string;
};

export type SendResetPasswordLinkRequest = {
  Body: SendResetPasswordLinkProps;
};

export class SendResetPasswordLinkController {
  private readonly sendResetPasswordLink: SendResetPasswordLinkService;
  private readonly verifyRecaptchaService: VerifyRecaptchaService;

  constructor() {
    this.sendResetPasswordLink = makeSendResetPasswordLinkService();
    this.verifyRecaptchaService = new VerifyRecaptchaService();
  }

  public async handle(request: FastifyRequest<SendResetPasswordLinkRequest>, reply: FastifyReply) {
    const { email, recaptcha_token } = request.body;

    await this.verifyRecaptchaService.execute({
      token: recaptcha_token,
      expected_action: "send_reset_password_link",
    });

    await this.sendResetPasswordLink.execute({ email: email });

    return reply.code(204).send();
  }
}
